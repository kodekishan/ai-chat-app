"use client";

import { Robot } from "@prisma/client";
import { ChatMessage } from "@/components/chat-message";

interface ChatMessagesProps {
  messages: any[];
  isLoading: boolean;
  robot: Robot;
}

export const ChatMessages = ({
  messages = [],
  isLoading,
  robot,
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage />
    </div>
  );
};
