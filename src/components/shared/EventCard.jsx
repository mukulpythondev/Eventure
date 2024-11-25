import Image from "next/image";

const EventCard = ({ title, description, date, location, category, imageUrl }) => {
  return (
    <div className="max-w-xs w-full group/card">
      <div className="cursor-pointer overflow-hidden relative h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col">
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
          <p className="font-normal text-sm text-gray-600 my-4">{description}</p>
          <p className="text-sm text-gray-500">{date}</p>
          <p className="text-sm text-gray-500">{location}</p>
          <span className="inline-block text-sm font-medium text-cyan-500">{category}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
