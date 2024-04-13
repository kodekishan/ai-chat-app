import { StreamingTextResponse, LangChainStream } from "ai";
import { currentUser } from "@clerk/nextjs";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextResponse } from "next/server";
import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.id || !user.firstName)
      return new NextResponse("Unauthorized", { status: 401 });

    const identifier = request.url + "-" + (user.id || "anonymous");
    const { success } = await rateLimit(identifier);
    if (!success)
      return new NextResponse("Rate limit exceeded", { status: 429 });

    const robot = await prismadb.robot.update({
      where: { id: params.chatId },
      data: {
        messages: {
          create: { content: prompt, role: "user", userId: user.id },
        },
      },
    });

    if (!robot) return new NextResponse("Robot not found", { status: 404 });

    const name = robot.id;
    const robot_file_name = name + ".txt";

    const robotKey = {
      robotName: name,
      userId: user.id,
      modelName: "llama2-13b",
    };

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(robotKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(robot.seed, "\n\n", robotKey);
    }

    await memoryManager.writeToHistory("User: " + prompt + "\n", robotKey);

    const recentChatHistory = await memoryManager.readLatestHistory(robotKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      robot_file_name
    );

    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    const { handlers } = LangChainStream();
    const model = new Replicate({
      model:
        "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    model.verbose = true;

    const resp = String(
      await model
        .call(
          `ONLY generate plain sentences without prefix of who is speaking, DO NOT use ${name}: prefix. 
        ${robot.instruction}
        Below are the relevant details about ${name}'s past and the conversation you are in.
        ${recentChatHistory}
        ${recentChatHistory}\n${name}:`
        )
        .catch(console.error)
    );
    const cleaned = resp?.replaceAll(",", "");
    const chunk = cleaned?.split("\n");
    const response = chunk[0];
    await memoryManager.writeToHistory("" + response.trim(), robotKey);
    var Readable = require("stream").Readable;
    let s = new Readable();
    s.push(response);
    s.push(null);

    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), robotKey);
      await prismadb.robot.update({
        where: { id: params.chatId },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "robot",
              userId: user.id,
            },
          },
        },
      });
    }
    console.log("Streaming the response");

    return new StreamingTextResponse(s);
  } catch (err) {
    console.error(`Chat Post Error: ${err}`);
    return new NextResponse(`Internal Error: ${err}`, { status: 500 });
  }
}
