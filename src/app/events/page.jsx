"use client"; // Add this line to indicate this is client-side code

import React, { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import EventCard from "@/components/shared/EventCard"; // Assuming you have an EventCard component

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const eventData = [
    {
      title: "Tech Conference 2024",
      description: "A full day of workshops and networking for developers.",
      date: "July 15, 2024",
      location: "New York City, NY",
      category: "Technology",
      imageUrl: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/yn/5c7cb3d5-c34b-49b8-9c1f-022fc44680b8",
    },
    {
      title: "Design Summit",
      description: "Join us for a day of design discussions and networking.",
      date: "August 20, 2024",
      location: "San Francisco, CA",
      category: "Design",
      imageUrl: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/9d/2ef4ad3e-e5ea-4e47-bd73-f0b16d10b518",
    },
    // More events
  ];

  const filteredEvents = eventData.filter((event) => {
    return (
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory ? event.category === selectedCategory : true)
    );
  });

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[30rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Find, Attend, Enjoy.<br />
            <span className="text-lg md:text-2xl text-gray-300"> Find what inspires you.
            </span>
          </h1>
        </div>
      </div>

      {/* Search and Category Filters */}
     <div className="h-full flex-col bg-black/[0.96] min-h-[55vh]" >
     <div className="max-w-7xl mx-auto p-4 flex flex-col items-center ">
        <div className="flex w-full max-w-2xl space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedCategory("Technology")}
            className={`px-4 py-2 rounded-md text-white bg-cyan-500 ${
              selectedCategory === "Technology" ? "bg-cyan-700" : "bg-cyan-500"
            }`}
          >
            Technology
          </button>
          <button
            onClick={() => setSelectedCategory("Design")}
            className={`px-4 py-2 rounded-md text-white bg-cyan-500 ${
              selectedCategory === "Design" ? "bg-cyan-700" : "bg-cyan-500"
            }`}
          >
            Design
          </button>
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-md text-white bg-cyan-500 ${
              selectedCategory === "" ? "bg-cyan-700" : "bg-cyan-500"
            }`}
          >
            All Categories
          </button>
        </div>
      </div>

      {/* Event Cards */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredEvents.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            description={event.description}
            date={event.date}
            location={event.location}
            category={event.category}
            imageUrl={event.imageUrl}
          />
        ))}
      </div>
     </div>
    </div>
  );
};

export default page;
