import {EventForm} from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";


export default async function  CreateEventPage() {
          const {userId} =  await auth();
  return (
    <div className=" pt-32 pb-10 bg-slate-950 text-cyan-200 flex flex-col items-center justify-center">
      <EventForm type='Create'  userId={userId || ""} />
    </div>
  );
}
