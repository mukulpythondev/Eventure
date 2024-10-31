"use client"
import { FlipWords } from "@/components/ui/flip-words";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
export default function Home() {
  const words = ["epic", "engaging", "memorable", "exclusive"];

  return (
    <div>
     <main className="md:h-[85vh] relative h-[90vh] md:bg-slate-950" >
     <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 1,
          ease: "easeInOut",
        }}
        className=" text-cyan-200 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
      Eventure
      <div className=" mt-5 flex justify-center items-center px-4">
      <div className="flex flex-col  gap-y-2 items-center justify-center text-3xl font-normal text-neutral-500   md:justify-start">
  <span>Make your event more</span>
  <FlipWords className="text-white mt-2 md:mt-0 md:ml-4" words={words} />
</div>

    </div>
      </motion.h1>
    </LampContainer>
    <div className="cta absolute bottom-[20vh]   w-full flex items-center justify-center">
    <button className="relative inline-flex  overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full text-xl w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-2 hover:text-cyan-500 duration-200 transition-all  font-medium text-white backdrop-blur-3xl">
    Create Event 
  </span>
</button>
    </div>
     </main>
  </div>
  );
}

