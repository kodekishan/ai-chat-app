import prismadb from "@/lib/prismadb";
import { RobotForm } from "./components/robot-form";

interface RobotIdPageProps {
  params: {
    robotId: string;
  };
}

const RobotIdPage = async ({ params }: RobotIdPageProps) => {
  const robot = await prismadb.robot.findUnique({
    where: { id: params.robotId },
  });
  return (
    <div className="bg-sky-50">
      <RobotForm data={robot} />
    </div>
  );
};

export default RobotIdPage;
