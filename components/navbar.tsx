"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";

const font = Poppins({ weight: "600", subsets: ["latin"] });

export const Navbar = () => {
  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/20 bg-sky-600 h-16">
      <div className="flex items-center">
        <h1
          className={cn(
            "text-xl md:text-3xl font-bold text-white",
            font.className
          )}
        >
          AI Chatting interface
        </h1>
      </div>
      <div className="flex items-center gap-x-3">
        <UserButton />
      </div>
    </div>
  );
};
