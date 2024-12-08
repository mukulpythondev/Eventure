import {EventForm} from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";


export default async function  UpdateEventPage() {
          const {userId, redirectToSignIn} =  await auth();
          if (!userId) return redirectToSignIn()
  return (
    <div className=" pt-20 pb-10 bg-slate-950 text-cyan-200 flex flex-col items-center justify-center">
      <EventForm type='Update'  userId={userId || ""} />
    </div>
  );
}
