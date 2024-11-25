import {EventForm} from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";


export default function CreateEventPage() {

  return (
    <div className=" pt-20 pb-10 bg-slate-950 text-cyan-200 flex flex-col items-center justify-center">
      <EventForm type='Create'  userId={""} />
    </div>
  );
}
