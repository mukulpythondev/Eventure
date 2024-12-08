"use client";

import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { eventSchema } from "@/lib/validator";
import { CldUploadButton } from 'next-cloudinary';
import { XIcon } from "lucide-react";
import { createEvent } from "@/lib/actions/events.action";
import { useRouter } from "next/navigation";
type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
};

// Type Inference for Form Values
type EventFormValues = z.infer<typeof eventSchema>;
type CloudinaryUploadResult = {
  info: {
    secure_url: string;
    original_filename: string;
  };
};
export function EventForm({ userId, type }: EventFormProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [eventType, setEventType] = useState("online");
  const [image, setImage] = useState<{ url: string; name: string } | null>(null);
  const EVENT_TYPES = ["meetup", "hackathon", "seminar", "workshop", "masterclass"];
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      eventImage: "",
      startDateTime: new Date().toISOString().slice(0, 16),
      endDateTime: new Date().toISOString().slice(0, 16),
      venue: "",
      isPaid: false,
      price: 0,
      totalSeats: 0,
      eventType: "online",
      hostEmail: "",
      category:""
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    console.log("Event data:", data);
    if(type=="Create")
    {
      try {
        const eventData = {
          ...data,
          startDateTime: new Date(data.startDateTime),
          endDateTime: new Date(data.endDateTime),
        };
        const newEvent= await createEvent({
          event:eventData,
          userId,
          path:'/profile'
        })
        if(newEvent)
        {
          console.log(newEvent)
          reset();
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
    // Add your API call logic here
  };

  return (
    <div className="max-w-lg w-full mx-auto rounded-md p-6 shadow-input bg-black text-neutral-200">
      <h2 className="font-bold text-xl">{`${type} your Event`}</h2>
      <p className="text-neutral-300 text-sm mt-2">
        Fill in the details below to {type.toLowerCase()} your event.
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Event Title */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="event-title" className="text-zinc-100" >Event Title</Label>
          <Input
            id="event-title"
            placeholder="Enter the event title"
            type="text"
            {...register("title")}
            className="bg-neutral-900 text-white border border-neutral-700"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </LabelInputContainer>

        {/* Event Image */}
        <LabelInputContainer className="mb-4">
        <Label htmlFor="event-image" className="text-zinc-100">Event Image</Label>
        
        {/* Cloudinary Upload Button */}
        <div className="border-2 flex items-center justify-center border-gray-400 w-fit px-3 py-1 " >
        <CldUploadButton
          uploadPreset="eventure"
          options={{
            maxFiles:1,
            maxFileSize:5 * 1024 * 1024, // 5MB
            clientAllowedFormats: ["image"], // Restrict to images only
            sources: ["local", "camera"],
          }}
          onSuccess={(result) => {
            const info= (result as CloudinaryUploadResult).info
            console.log(result);
            setValue("eventImage", info.secure_url)
            setImage({
              url: info.secure_url,
              name: info.original_filename,
            });
          }}
          onError={(error) => {
            console.error("Cloudinary upload error:", error);
          }}
        />
         <input
        type="hidden"
        {...register("eventImage", { required: true })}
      />
        </div>
         {image && (
            <div className="mt-2 w-2/6 flex items-center justify-between px-2 gap-2 bg-neutral-800 py-1 rounded-md">
              <span className="text-gray-200 text-sm truncate ">
                {image.name.length > 20 ? `${image.name.slice(0, 20)}...` : image.name}
              </span>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="text-red-500"
                title="Remove image"
              >
                <XIcon size={24} />
              </button>
            </div>
          )}
        {/* Display the uploaded image URL */}
        <p className="text-sm text-gray-400 mt-2">{errors.eventImage && <span>{errors.eventImage.message}</span>}</p>
      </LabelInputContainer>

        {/* Category Dropdown */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="category" className="text-zinc-100">Category</Label>
          <select
            id="category"
            {...register("category")}
            className="bg-neutral-900 text-white border border-neutral-700 p-2 rounded-md"
          >
            {EVENT_TYPES.map((item,key)=> {
              return <option key={key} value={`${item}`}>{item.toUpperCase()}</option>
            })}
            
           
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </LabelInputContainer>

        {/* Start Date */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="start-date" className="text-zinc-100">Start Date</Label>
          <Input
            id="start-date"
            type="datetime-local"
            {...register("startDateTime")}
            className="bg-neutral-900 text-gray-300 border date-picker-input border-neutral-700"
          />
          {errors.startDateTime && <p className="text-red-500 text-sm">{errors.startDateTime.message}</p>}
        </LabelInputContainer>

        {/* End Date */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="end-date" className="text-zinc-100">End Date</Label>
          <Input
            id="end-date"
            type="datetime-local"
            {...register("endDateTime")}
            className="bg-neutral-900 text-gray-300 border date-picker-input border-neutral-700"
          />
          {errors.endDateTime && <p className="text-red-500 text-sm">{errors.endDateTime.message}</p>}
        </LabelInputContainer>

        {/* Venue */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="venue" className="text-zinc-100">Venue</Label>
          <Input
            id="venue"
            placeholder="Enter the venue"
            type="text"
            {...register("venue")}
            className="bg-neutral-900 text-white border border-neutral-700"
          />
          {errors.venue && <p className="text-red-500 text-sm">{errors.venue.message}</p>}
        </LabelInputContainer>

        {/* Is Paid */}
        <LabelInputContainer className="flex items-center mb-4 gap-5 justify-start flex-row ">
          <Label htmlFor="is-paid" className="text-zinc-100 ">Is Paid</Label>
          <input
            id="is-paid"
            type="checkbox"
            {...register("isPaid")}
            className="text-xl"
            onChange={(e) => setIsPaid(e.target.checked)}
          />
        </LabelInputContainer>
        {/* Conditional Paid Fields */}
        {isPaid && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="price" className="text-zinc-100">Price</Label>
              <Input
                id="price"
                type="number"
                {...register("price")}
                className="bg-neutral-900 text-white border border-neutral-700"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </LabelInputContainer>

           
          </>
        )}
         <LabelInputContainer className="mb-4">
              <Label htmlFor="total-seats" className="text-zinc-100">Total Seats</Label>
              <Input
                id="total-seats"
                type="number"
                {...register("totalSeats")}
                className="bg-neutral-900 text-white border border-neutral-700"
              />
              {errors.totalSeats && <p className="text-red-500 text-sm">{errors.totalSeats.message}</p>}
            </LabelInputContainer>
        {/* Event Type */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="event-type" className="text-zinc-100">Event Type</Label>
          <select
            id="event-type"
            {...register("eventType")}
            className="bg-neutral-900 text-white border border-neutral-700 p-2 rounded-md"
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          {errors.eventType && <p className="text-red-500 text-sm">{errors.eventType.message}</p>}
        </LabelInputContainer>

        {/* Organizer Email */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="organizer-email" className="text-zinc-100">Organizer Email</Label>
          <Input
            id="organizer-email"
            placeholder="Enter the organizer's email"
            type="email"
            {...register("hostEmail")}
            className="bg-neutral-900 text-white border border-neutral-700"
          />
          {errors.hostEmail && <p className="text-red-500 text-sm">{errors.hostEmail.message}</p>}
        </LabelInputContainer>

        {/* Event Description */}
        <LabelInputContainer className="mb-6">
          <Label htmlFor="description" className="text-zinc-100">Event Description</Label>
          <textarea
            id="description"
            placeholder="Provide a detailed description of the event"
            {...register("description")}
            className="bg-neutral-900 text-white rounded-md p-2 w-full"
            rows={5}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </LabelInputContainer>

        {/* Submit Button */}
        <button
          className="bg-gradient-to-br from-gray-800 to-gray-600 w-full text-white rounded-md h-10 font-medium shadow-md hover:opacity-90"
          type="submit"
        >
          {type} Event
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
