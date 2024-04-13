"use client";
import axios from "axios";
import { Message, Robot } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BotAvatar } from "@/components/bot-avatar";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/use-toast";

interface ChatHeaderProps {
  robot: Robot & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export const ChatHeader = ({ robot }: ChatHeaderProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/robot/${robot.id}`);
      toast({
        className: "bg-green-600 text-white",
        description: "Deleted Successfully",
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex w-full justify-between items-center border-b border-sky-950 border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-sky-600 hover:text-white text-sky-600"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <BotAvatar src={robot.src} />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{robot.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="w-4 h-4 mr-1" />
              {robot._count.messages}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Created by {robot.userName}
          </p>
        </div>
      </div>
      {user?.id === robot.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-sm">
            <DropdownMenuItem
              className="text-green-700 cursor-pointer focus:text-green-500"
              onClick={() => router.push(`/robot/${robot.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-700 cursor-pointer focus:text-red-500"
              onClick={onDelete}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
