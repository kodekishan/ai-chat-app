"use client";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-sky-100">
      <div className="flex items-center">
        <h1>AI Chatting interface</h1>
      </div>
      <div className="flex items-center gap-x-3">
        <UserButton />
      </div>
    </div>
  );
};
