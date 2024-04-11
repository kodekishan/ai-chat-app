import { Robot } from "@prisma/client";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";

interface RobotsProp {
  data: (Robot & { _count: { messages: number } })[];
}

export const Robots = ({ data }: RobotsProp) => {
  if (data?.length === 0) {
    return (
      <div className="pt-10 flex flex-col items-center justify-center space-y-3">
        <div className="relative w-80 h-80">
          <Image fill alt="empty" src="/empty.png" />
        </div>
      </div>
    );
  }
  return (
    <div className="mx-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-col-6 gap-2 pb-10">
      {data.map((item) => (
        <Card
          key={item.id}
          className="bg-white rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link href={`/chat/${item.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                <Image
                  fill
                  src={item.src}
                  className="rounded-xl object-cover"
                  alt={`robot-${item.id}`}
                />
              </div>
              <p className="text-lg font-bold text-sky-600">{item.name}</p>
              <p className="text-sm text-black">{item.description}</p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="lowercase">@{item.userName}</p>
              <div className="flex item-center text-sky-500">
                <MessagesSquare className="w-4 h-4 mr-1" />
                {item._count.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};
