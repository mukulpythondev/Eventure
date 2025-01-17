"use client";

import React, { useEffect, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import EventCard from "@/components/shared/EventCard"; // Assuming you have an EventCard component
import { getAllEvents } from "@/lib/actions/events.action";
import { formatDateTime } from "@/lib/utils";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allEvents, setAllEvents] = useState([]); // Store all events here
  const [filteredEvents, setFilteredEvents] = useState([]); // Store filtered events here
  const [loading, setLoading] = useState(true); // State for loader

  // Fetch all events once when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true); // Show loader
        const events = await getAllEvents({ query: "", category: "", page: 1 });
        console.log(events);
        setAllEvents(events.data || []); // Set all events
        setFilteredEvents(events.data || []); // Initially, filtered events are all events
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); // Hide loader
      }
    };
    fetchEvents();
  }, []);

  // Apply search and category filters locally on all events
  useEffect(() => {
    const filtered = allEvents.filter((event) => {
      return (
        (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory ? event.category === selectedCategory.toLowerCase() : true)
      );
    });
    setFilteredEvents(filtered); // Update filtered events
  }, [searchTerm, selectedCategory, allEvents]); // Re-run the filter when searchTerm, selectedCategory, or allEvents change

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[30rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Find, Attend, Enjoy.<br />
            <span className="text-lg md:text-2xl text-gray-300"> Find what inspires you.</span>
          </h1>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="h-full flex-col bg-black/[0.96] min-h-[55vh]">
        <div className="max-w-7xl mx-auto p-4 flex flex-col items-center">
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
              onClick={() => setSelectedCategory("Workshop")}
              className={`px-4 py-2 rounded-md text-white bg-cyan-500 ${
                selectedCategory === "Workshop" ? "bg-cyan-700" : "bg-cyan-500"
              }`}
            >
              Workshop
            </button>
            <button
              onClick={() => setSelectedCategory("Masterclass")}
              className={`px-4 py-2 rounded-md text-white bg-cyan-500 ${
                selectedCategory === "Masterclass" ? "bg-cyan-700" : "bg-cyan-500"
              }`}
            >
              Masterclass
            </button>
            <button
              onClick={() => setSelectedCategory("Meetup")}
              className={`px-4 py-2 rounded-md text-white bg-cyan-500 ${
                selectedCategory === "Meetup" ? "bg-cyan-700" : "bg-cyan-500"
              }`}
            >
              Meetup
            </button>
            <button
              onClick={() => setSelectedCategory("Seminar")}
              className={`px-4 py-2 rounded-md text-white bg-cyan-500 ${
                selectedCategory === "Seminar" ? "bg-cyan-700" : "bg-cyan-500"
              }`}
            >
              Seminar
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
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent rounded-full text-cyan-500" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                description={event.description}
                startdate={formatDateTime(event.startDateTime).dateTime}
                enddate={formatDateTime(event.endDateTime).dateTime}
                venue={event.venue}
                category={event.category}
                imageUrl={event.eventImage}
                _id={event._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
