'use client';

import { useState } from 'react';
import { joinEvent } from '@/lib/actions/events.action';

const EventDetailsClient = ({ event, isRegistered: initialIsRegistered, isHost, canRegister, clerkId }: any) => {
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered); // Track registration state

  const handleJoinEvent = async () => {
    setIsLoading(true);
    try {
      const response = await joinEvent(event._id, clerkId);
      if (response && response.message) {
        setJoinMessage(response.message);
        if (response.message.includes('Successfully')) {
          setIsRegistered(true); // Update registration state
        }
      } else {
        setJoinMessage('An error occurred while joining the event.');
      }
    } catch (error: any) {
      setJoinMessage(error.message || 'An error occurred while joining the event.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Show Join Button */}
      {!isRegistered && canRegister && !isHost && (
        <button
          onClick={handleJoinEvent}
          disabled={isLoading}
          className={`mt-2 py-1 px-3 bg-cyan-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? 'Joining...' : 'Join Event'}
        </button>
      )}

      {/* Display Success/Failure Message */}
      {joinMessage && (
        <p className={`mt-2 text-sm ${joinMessage.includes('Successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {joinMessage}
        </p>
      )}

      {/* Show Registered Status */}
      {isRegistered && (
        <button className="mt-2 text-white px-2 py-2 rounded-md font-medium text-lg bg-cyan-500">
          Registered
        </button>
      )}

      {/* Show Host Status */}
      {isHost && (
        <button className="mt-2 text-orange-500 font-medium text-lg">
          You are the Host
        </button>
      )}

      {/* Show Registration Closed Message */}
      {!canRegister && !isRegistered && !isHost && (
        <button className="mt-2 text-white p-2 rounded-md font-medium text-lg bg-red-500">
          Registration Closed
        </button>
      )}
    </div>
  );
};

export default EventDetailsClient;
