"use client";

import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

export interface ChatMessageProps {
  role: "robot" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
}

export const ChatMessage = ({
  role,
  content,
  isLoading,
  src,
}: ChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  return <div>Message</div>;
};
