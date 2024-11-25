"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type EventFormProps ={
    userId: string,
    type: "Create" | "Update"
  }
export function EventForm({userId, type}: EventFormProps) {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venue, setVenue] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be later than start date.");
      return;
    }

    const eventData = {
      title: eventTitle,
      startDate,
      endDate,
      venue,
      organizerName,
      organizerEmail,
      description,
    };

    console.log("Event data:", eventData);
    alert("Event created successfully!");
    // Add your submission logic here (e.g., API call)
  };

  return (
    <div className="max-w-lg w-full mx-auto rounded-md p-6 shadow-input bg-black text-neutral-200">
      <h2 className="font-bold text-xl">Create an Event</h2>
      <p className="text-neutral-300 text-sm mt-2">
        Fill in the details below to create your event.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Event Title */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="event-title">Event Title</Label>
          <Input
            id="event-title"
            placeholder="Enter the event title"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="bg-neutral-900 text-white border border-neutral-700"
            required
          />
        </LabelInputContainer>

        {/* Start Date */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="start-date">Start Date</Label>
          <input
            id="start-date"
            type="datetime-local" // Changed to simple date picker
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-neutral-900 text-gray-300 border date-picker-input border-neutral-700"
            required
          />
        </LabelInputContainer>

        {/* End Date */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="end-date">End Date</Label>
          <input
            id="end-date"
            type="datetime-local" // Changed to simple date picker
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-neutral-900 date-picker-input text-gray-300 border border-neutral-700"
            required
          />
        </LabelInputContainer>

        {/* Venue */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            placeholder="Enter the venue"
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="bg-neutral-900 text-white border border-neutral-700"
            required
          />
        </LabelInputContainer>

        {/* Organizer Name */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="organizer-name">Organizer Name</Label>
          <Input
            id="organizer-name"
            placeholder="Enter the organizer's name"
            type="text"
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
            className="bg-neutral-900 text-white border border-neutral-700"
            required
          />
        </LabelInputContainer>

        {/* Organizer Email */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="organizer-email">Organizer Email</Label>
          <Input
            id="organizer-email"
            placeholder="Enter the organizer's email"
            type="email"
            value={organizerEmail}
            onChange={(e) => setOrganizerEmail(e.target.value)}
            className="bg-neutral-900 text-white border border-neutral-700"
            required
          />
        </LabelInputContainer>

        {/* Event Description */}
        <LabelInputContainer className="mb-6">
          <Label htmlFor="description">Event Description</Label>
          <textarea
            id="description"
            placeholder="Provide a detailed description of the event"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-neutral-900 text-white rounded-md p-2 w-full"
            rows={5}
            required
          />
        </LabelInputContainer>

        {/* Submit Button */}
        <button
          className="bg-gradient-to-br from-gray-800 to-gray-600 w-full text-white rounded-md h-10 font-medium shadow-md hover:opacity-90"
          type="submit"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
