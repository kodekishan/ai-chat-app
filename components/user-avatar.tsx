import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

export const UserAvatar = () => {
  const { user } = useUser();
  return (
    <Avatar className="h-12 w-12 shadow-md">
      <AvatarImage src={user?.imageUrl} />
    </Avatar>
  );
};
