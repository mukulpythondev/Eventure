import { getEventById, getUserByClerkId } from '@/lib/actions/events.action';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { auth } from "@clerk/nextjs/server";
import EventDetailsClient from '@/components/shared/EventDetailsClient';

const EventDetails = async ({ params, searchParams }: any) => {
  const { id } = await params;
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    console.error('User is not authenticated');
    return <div>User is not authenticated</div>;
  }

  // Fetch user details using Clerk ID
  const user = await getUserByClerkId(clerkUserId);
  if (!user) {
    console.error('User not found in the database');
    return <div>User not found</div>;
  }

  const event = await getEventById(id);
  if (!event) {
    console.error('Event not found');
    return <div>Event not found</div>;
  }

  // Check if the user is registered and if they are the host
  const isRegistered = event.attendees.includes(clerkUserId);
  const isHost = user._id.toString() === event.host._id.toString();
  const eventStartDate = new Date(event.startDateTime);
  const today = new Date();
  const oneDayBeforeStart = new Date(eventStartDate);
  oneDayBeforeStart.setDate(eventStartDate.getDate() - 1);
  const canRegister = today <= oneDayBeforeStart;

  return (
    <>
      <section className="flex pt-40 justify-center bg-black/[0.96] pb-10 px-5">
        <div className="grid grid-cols-1 gap-8 max-w-5xl">
          <Image
            src={event.eventImage}
            alt="Event Image"
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg"
          />

          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl text-zinc-100 font-bold mb-4">{event.title}</h2>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                  {event.isFree ? 'FREE' : `$${event.price}`}
                </span>
                <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                  {event.category}
                </span>
                <p className="text-white text-sm">
                  by <span className="text-blue-600">{event.host.firstName} {event.host.lastName}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-cyan-600" size={20} />
                <p className="text-zinc-200 text-sm">
                  {formatDateTime(event.startDateTime).dateOnly} - {formatDateTime(event.startDateTime).timeOnly}
                </p>
                <p className="text-zinc-200 text-sm">
                  {formatDateTime(event.endDateTime).dateOnly} - {formatDateTime(event.endDateTime).timeOnly}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-cyan-200" size={20} />
                <p className="text-gray-200 text-sm">{event.venue}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">What You'll Learn:</h3>
              <p className="text-zinc-200 mb-2">{event.description}</p>
              <a href={event.url} className="text-blue-600 underline text-sm">
                {event.url}
              </a>
            </div>

            <EventDetailsClient
              event={event}
              clerkId={clerkUserId}
              isRegistered={isRegistered}
              isHost={isHost}
              canRegister={canRegister}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
