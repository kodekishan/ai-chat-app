"use client";

import { ChatRequestOptions } from "ai";
import { ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

interface ChatFormProps {
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatReqestOption?: ChatRequestOptions | undefined
  ) => void;
  isLoading: boolean;
}

export const ChatForm = ({
  input,
  handleInputChange,
  onSubmit,
  isLoading,
}: ChatFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-sky-950 py-4 flex items-center gap-x-2"
    >
      <Input
        disabled={isLoading}
        onChange={handleInputChange}
        placeholder="Type a message"
        className="rounded-lg"
      />
      <Button
        disabled={isLoading}
        variant="ghost"
        className="text-sky-600 hover:text-white hover:bg-sky-600"
      >
        <SendHorizonal className="w-6 h-6" />
      </Button>
    </form>
  );
};
