"use server";

import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/utils";
import QRCode from 'qrcode'; 
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
import {sendEmail} from "@/lib/sendEmail";
import { uploadToS3 } from "../uploadS3";
import { HttpError } from '@/lib/utils'; 

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
    organizer.hostedEvents.push(newEvent._id)
    organizer.save();
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
export const getUserByClerkId = async (clerkId: string) => {
  try {
   await dbConnect();
   const user=await User.findOne({ clerkId }).populate('rsvps')
   .populate('attendedEvents')
   .populate('hostedEvents');
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error fetching user by Clerk ID:', error);
    throw new Error('Error fetching user');
  }
};
export async function joinEvent(eventId: string, clerkId: string) {
  try {
    await dbConnect();

    // Fetch the event by ID
    const event = await Event.findById(eventId);
    const eventPopulated = await populateEvent(event);
    if (!event) throw new Error("Event not found");

    // Fetch the user by clerkId
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    // Check if the user is the host
    if (String(eventPopulated.host._id) === String(user._id)) {
      throw new Error("Event host cannot join their own event");
    }

    // If the event is free, handle joining logic
    if (!event.isPaid) {
      // Check if the user has already joined
      if (event.attendees.includes(user._id)) {
        throw new Error("You have already joined this event");
      }

      // Add user to the event's attendees list
      event.attendees.push(clerkId);
      event.bookedSeats += 1;
      await event.save();

      // Check if the event is already in the user's RSVPs
      if (user.rsvps.includes(eventId)) {
        throw new Error("You have already RSVP'd to this event");
      }

      // Add event to the user's RSVPs
      user.rsvps.push(eventId);
      await user.save();

      // Step 1: Generate the QR code for attendance
      const qrCodeData = JSON.stringify({ eventId, clerkId });
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
      const qrUrl= await uploadToS3(qrCodeDataUrl,"eventQR")
      // Step 2: Create dynamic HTML content for the email
      const htmlContent = `
        <h2>Event Registration Successful!</h2>
        <p>Thank you for registering for the event: <strong>${event.title}</strong>.</p>
        <p>Your event details are below:</p>
        <ul>
          <li><strong>Event ID:</strong> ${eventId}</li>
          <li><strong>Event Name:</strong> ${event.title}</li>
          <li><strong>Event Date:</strong> ${event.startDateTime.toDateString()}</li>
          <li><strong>Location:</strong> ${event.venue}</li>
        </ul>
        <p><strong>Your Attendance QR Code:</strong></p>
        <img src="${qrUrl}" alt="QR Code for Attendance" />
        <p>Scan this QR code at the event venue to mark your attendance.</p>
      `;

      // Step 3: Send the email with the QR code
      await sendEmail({
        to: user.email, // Send to user's email
        subject: `Your Registration for ${event.title}`,
        htmlContent, // Email content with the QR code
      });

      return { message: "Successfully joined the event! A confirmation email with QR code has been sent." };
    }

    // If the event is paid, return a message to buy a ticket
    return { message: "Please purchase a ticket to join this event" };
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while joining the event');
  }
}
export async function attendanceAction(eventId: string, clerkId: string) {
  try {
    await dbConnect();

    // Fetch the event by ID
    const event = await Event.findById(eventId);
    if (!event) throw new HttpError(404, "Event not found");

    // Fetch the user by clerkId
    const user = await User.findOne({ clerkId });
    if (!user) throw new HttpError(404, "User not found");

    // Check if the user is the host
    if (String(event.host._id) === String(user._id)) {
      throw new HttpError(403, "Event host cannot attend their own event");
    }

    // Check if the user is already attending the event
    if (event.attendance.includes(clerkId)) {
      throw new HttpError(409, "You have already marked your attendance for this event");
    }

    // Add the user to the event's attendees list
    event.attendance.push(clerkId);
    await event.save();

    // Add the event to the user's attendedEvents list
    user.attendedEvents.push(eventId);
    await user.save();

    return { message: "Attendance recorded successfully." };
  } catch (error: any) {
    console.error("Error recording attendance:", error);

    // Re-throw custom HTTP errors, or wrap other errors
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "An error occurred while recording attendance");
  }
}

