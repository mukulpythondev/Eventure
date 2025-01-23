"use client";

import React, { useState, useEffect } from "react";
import EventCard from "@/components/shared/EventCard";
import QRScanner from "@/components/shared/QRScanner";
import { formatDateTime } from "@/lib/utils";
import { getUserByClerkId } from "@/lib/actions/events.action";
import { useAuth } from "@clerk/nextjs";
import { X } from "lucide-react";

const YourEventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("RSVPs");
  const [showQRModal, setShowQRModal] = useState(false);
  const [user, setUser] = useState<any>(null); // Replace `any` with your user type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return; // Ensure userId is available
      try {
        setLoading(true); // Start loading
        const response = await getUserByClerkId(userId);
        setUser(response);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (isLoaded && userId) {
      fetchUser();
    } else {
      setLoading(false); // Stop loading if userId is not available
    }
  }, [isLoaded, userId]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">{error}</div>;
  }

  // Filter events based on the active tab
  const filteredEvents =
    activeTab === "RSVPs"
      ? user?.rsvps || []
      : activeTab === "Attended"
      ? user?.attendedEvents || []
      : user?.hostedEvents || [];

  return (
    <div className="min-h-screen pt-32 bg-black text-white">
      {/* Header */}
      <header className=" py-6 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">Your Events</h1>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <div className="flex justify-center space-x-4 mb-6">
          {[
            { name: "RSVPs", label: "RSVPs" },
            { name: "Attended", label: "Attended Events" },
            { name: "Hosted", label: "Hosted Events" },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 rounded-md text-white transition ${
                activeTab === tab.name ? "bg-cyan-700" : "bg-cyan-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* QR Code Scanner Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowQRModal(true)}
            className="px-4 py-2 bg-cyan-500 rounded-md text-white hover:bg-cyan-700"
          >
            Scan QR Code
          </button>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any, index:number) => (
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
          ))}
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-4 max-w-lg w-full relative">
            <button
              onClick={() => setShowQRModal(false)}
              className=" absolute -top-10  right-2 text-red-400 "
            >
              <X size={32} />
            </button>
            <QRScanner />
          </div>
        </div>
      )}
    </div>
  );
};

export default YourEventsPage;
