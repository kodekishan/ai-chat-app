import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instruction, seed } = body;

    if (!user || !user.id || !user.firstName)
      return new NextResponse("Unauthorized", { status: 401 });

    if (!src || !name || !description || !instruction || !seed)
      return new NextResponse("Missing parameters", { status: 400 });

    const robot = await prismadb.robot.create({
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
    console.error("Robot POST", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
