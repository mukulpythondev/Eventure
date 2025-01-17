import { getEventById } from '@/lib/actions/events.action';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { auth } from '@clerk/nextjs/server'
const EventDetails = async ({ params, searchParams }: any) => {
  const { id } = await params;
  const event = await getEventById(id);

  // Simulating userId (replace with actual user data when available)
  const { userId } = await auth();
  const isRegistered = userId ? event.attendees.includes(userId) : false;
  const isHost = userId === event.host;

  const eventStartDate = new Date(event.startDateTime);
  const today = new Date();
  const oneDayBeforeStart = new Date(eventStartDate);
  oneDayBeforeStart.setDate(eventStartDate.getDate() - 1);
  const canRegister = today <= oneDayBeforeStart;

  const handleJoinEvent = () => {
    console.log('Joining event:', event._id);
    // Add join event logic here
  };

  
    // console.log('User ID:', userId);
    // console.log('Event host:', event.host);
    // console.log('Can Register:', canRegister);
    // console.log(isHost)

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

            <div>
              {!isRegistered && canRegister && !isHost && (
                <button
                  onClick={handleJoinEvent}
                  className="mt-2 py-1 px-3 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition"
                >
                  Join Event
                </button>
              )}

              {isRegistered && (
                <p className="mt-2 text-green-500 font-medium text-sm">Registered</p>
              )}

              {isHost && (
                <p className="mt-2 text-orange-500 font-medium text-sm">You are the Host</p>
              )}

              {!canRegister && !isRegistered && !isHost && (
                <p className="mt-2 text-red-500 font-medium text-lg ">Registration Closed</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
