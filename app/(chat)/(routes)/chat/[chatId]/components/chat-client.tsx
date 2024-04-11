"use client";

import { ChatHeader } from "@/components/chat-header";
import { Message, Robot } from "@prisma/client";

interface ChatClientProps {
  robot: Robot & { messages: Message[]; _count: { messages: number } };
}

export const ChatClient = ({ robot }: ChatClientProps) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-2 ">
      <ChatHeader robot={robot} />
    </div>
  );
};
