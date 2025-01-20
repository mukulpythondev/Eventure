'use client';

import { useState } from 'react';
import { joinEvent, deleteEvent } from '@/lib/actions/events.action';
import { useRouter } from 'next/navigation';

const EventDetailsClient = ({ event, isRegistered: initialIsRegistered, isHost, canRegister, clerkId }: any) => {
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered); // Track registration state
  const router = useRouter();

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

  const handleDeleteEvent = async () => {
    setIsLoading(true);
    try {
      await deleteEvent({ eventId: event._id, path: '/events' });
      router.push('/events'); // Redirect to events list after deletion
    } catch (error: any) {
      console.error('Error deleting event:', error.message);
      setJoinMessage('An error occurred while deleting the event.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Show Join Button */}
      {!isRegistered && canRegister && !isHost && (
        <button
          onClick={handleJoinEvent}
          disabled={isLoading}
          className={`mt-2 w-fit py-1 px-3 bg-cyan-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? 'Joining...' : 'Join Event'}
        </button>
      )}

      {/* Display Success/Failure Message */}
      {joinMessage && (
        <p className={`mt-2 w-fit text-sm ${joinMessage.includes('Successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {joinMessage}
        </p>
      )}

      {/* Show Registered Status */}
      {isRegistered && (
        <button className="mt-2 w-fit text-white px-2 py-2 rounded-md font-medium text-lg bg-cyan-500">
          Registered
        </button>
      )}

      {/* Show Host Buttons */}
      {isHost && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => router.push(`/events/${event._id}/update`)}
            className="py-1 px-3 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition"
          >
            Edit Event
          </button>
          <button
            onClick={handleDeleteEvent}
            disabled={isLoading}
            className={`py-1 px-3 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      )}

      {/* Show Registration Closed Message */}
      {!canRegister && !isRegistered && !isHost && (
        <button className="mt-2 w-fit text-white p-2 rounded-md font-medium text-lg bg-red-500">
          Registration Closed
        </button>
      )}
    </div>
  );
};

export default EventDetailsClient;
