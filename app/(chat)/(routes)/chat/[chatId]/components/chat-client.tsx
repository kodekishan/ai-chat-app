"use client";
import { useCompletion } from "ai/react";
import { ChatHeader } from "@/components/chat-header";
import { Message, Robot } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ChatForm } from "@/components/chat-form";
import { ChatMessages } from "@/components/chat-messages";

interface ChatClientProps {
  robot: Robot & { messages: Message[]; _count: { messages: number } };
}

export const ChatClient = ({ robot }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(robot.messages);
  const {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useCompletion({
    api: `/api/chat/${robot.id}`,
    onFinish(prompt, completion) {
      const systemMessage = {
        role: "robot",
        content: completion,
      };
      setMessages((current) => [...current, systemMessage]);
      setInput("");
      router.refresh();
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage = {
      role: "user",
      content: input,
    };
    setMessages((current) => [...current, userMessage]);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2 ">
      <ChatHeader robot={robot} />
      <ChatMessages robot={robot} isLoading={isLoading} messages={messages} />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
