"use client";

import { Robot } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  robot: Robot;
}

export const ChatMessages = ({
  messages = [],
  isLoading,
  robot,
}: ChatMessagesProps) => {
  const router = useRouter();
  const scrollRef = useRef<ElementRef<"div">>(null);

  const [loading, setLoading] = useState(messages.length === 0 ? true : false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={loading}
        src={robot.src}
        role="robot"
        content={`Hello, I am ${robot.name}, ${robot.description}`}
      />
      {messages.map((message) => (
        <ChatMessage
          key={message.content}
          role={message.role}
          content={message.content}
          src={robot.src}
        />
      ))}
      {isLoading && <ChatMessage role="robot" src={robot.src} isLoading />}
      <div ref={scrollRef} />
    </div>
  );
};
