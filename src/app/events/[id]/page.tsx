import { getEventById } from '@/lib/actions/events.action';
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react'; // Using icons from lucide-react

const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const event = await getEventById(id);

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

          <div className="flex  flex-col gap-6">
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
              <p className=" text-zinc-200 mb-2">{event.description}</p>
              <a href={event.url} className="text-blue-600 underline text-sm">
                {event.url}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
