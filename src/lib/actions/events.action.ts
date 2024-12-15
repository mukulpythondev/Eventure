"use server";

import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/utils";

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";
import { dbConnect } from "../database/db";
import Event from "../models/eventModel";
import User from "../models/userModel";

const populateEvent = (query: any) =>
  query.populate({ path: "host", model: User, select: "_id firstName lastName" });

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await dbConnect();
    console.log(" clerk user id " ,userId)
    // Find the user by Clerk ID instead of MongoDB _id
    const organizer = await User.findOne({ clerkId: userId });
    if (!organizer) throw new Error("Organizer not found");

    // Create the event using the organizer's MongoDB _id
    const newEvent = await Event.create({ ...event, host: organizer._id });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await dbConnect();

    const event = await populateEvent(Event.findById(eventId));
    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await dbConnect();

    // Find the user using the Clerk ID
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    // Find the event and ensure the host matches the user
    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate || eventToUpdate.host.toString() !== user._id.toString()) {
      throw new Error("Unauthorized or event not found");
    }

    // Proceed with the update
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}


// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await dbConnect();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await dbConnect();

    const titleCondition = query ? { title: { $regex: query, $options: "i" } } : {};
    const conditions: any = {
      ...titleCondition,
      ...(category && { category }),
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .lean(); // Use lean for faster queries

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await dbConnect();

    // Find the user using the Clerk ID
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    // Use the user's MongoDB _id to filter events
    const conditions = { host: user._id };
    const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .lean();

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) };
  } catch (error) {
    handleError(error);
  }
}
export async function getRelatedEventsByCategory({
  category,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await dbConnect();

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: category }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}