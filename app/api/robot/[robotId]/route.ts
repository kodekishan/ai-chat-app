import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { robotId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instruction, seed } = body;

    if (!params.robotId)
      return new NextResponse("Robot Id is required", { status: 400 });

    if (!user || !user.id || !user.firstName)
      return new NextResponse("Unauthorized", { status: 401 });

    if (!src || !name || !description || !instruction || !seed)
      return new NextResponse("Missing parameters", { status: 400 });

    const robot = await prismadb.robot.update({
      where: { id: params.robotId },
      data: {
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instruction,
        seed,
      },
    });

    return NextResponse.json(robot);
  } catch (err) {
    console.error("Robot PATCH", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
