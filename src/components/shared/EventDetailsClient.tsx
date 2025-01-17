'use client';

import { useState } from 'react';
import { joinEvent } from '@/lib/actions/events.action';

const EventDetailsClient = ({ event, userId, isRegistered, isHost, canRegister }: any) => {
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinEvent = async () => {
    setIsLoading(true);
    try {
      const response = await joinEvent(event._id, userId);
      if (response && response.message) {
        setJoinMessage(response.message);
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
      {!isRegistered && canRegister && !isHost && (
        <button
          onClick={handleJoinEvent}
          disabled={isLoading}
          className={`mt-2 py-1 px-3 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? 'Joining...' : 'Join Event'}
        </button>
      )}

      {joinMessage && (
        <p className={`mt-2 text-sm ${joinMessage.includes('Successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {joinMessage}
        </p>
      )}

      {isRegistered && (
        <p className="mt-2 text-green-500 font-medium text-sm">Registered</p>
      )}

      {isHost && (
        <p className="mt-2 text-orange-500 font-medium text-sm">You are the Host</p>
      )}

      {!canRegister && !isRegistered && !isHost && (
        <p className="mt-2 text-gray-500 font-medium text-sm">Registration Closed</p>
      )}
    </div>
  );
};

export default EventDetailsClient;
