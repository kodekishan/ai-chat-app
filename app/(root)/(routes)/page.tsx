import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import { Robots } from "@/components/robots";

interface RootPageProps {
  searchParams: {
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const robotData = await prismadb.robot.findMany({
    where: {
      name: searchParams.name,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
  return (
    <div className="h-full p-4 space-y-2 bg-sky-50">
      <SearchInput />
      <Robots data={robotData} />
    </div>
  );
};

export default RootPage;
