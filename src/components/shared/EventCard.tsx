import { LocateIcon, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
type EventCardProps= {
  title:string,
  description:string,
  startdate:string,
  enddate:string,
  venue:string,
  category:string,
  imageUrl:string,
  _id: string
}
const EventCard = ({ title, description, startdate, enddate,venue, category, imageUrl , _id} : EventCardProps) => {
  return (
    <div className="max-w-xs w-full group/card">
      <Link href={`/events/${_id}`} className="cursor-pointer overflow-hidden relative h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col">
        {/* Background image in the top half */}
        <div
          className="w-full h-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          {/* Optional: You can add an overlay effect here */}
          {/* <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div> */}
        </div>

        {/* Event Content in the bottom half */}
        <div className="p-4 flex flex-col justify-between h-1/2 bg-white">
          <h1 className="font-bold text-xl md:text-2xl text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{startdate}  - {enddate}</p>
          <span className="inline-block bg-gray-200 w-fit text-sm font-medium text-cyan-500">{category}</span>
          <p>{description.length > 20 ? `${description.slice(0, 20)}...` : description}</p>
          <p className="text-sm flex gap-2 font-bold text-gray-500"> <MapPin/> {venue}</p>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
