import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type RobotKey = {
  robotName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone();
  }

  public init() {
    if (this.vectorDBClient instanceof Pinecone) {
      this.vectorDBClient = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });
    }
  }

  public async vectorSearch(recentChatHistory: string, robotFileName: string) {
    const pineconeClient = <Pinecone>this.vectorDBClient;
    const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_API_KEY }),
      { pineconeIndex }
    );
    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: robotFileName })
      .catch((err) => {
        console.log(`Failed to get vector search results: ${err}`);
      });

    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
  }

  private generateRedisRobotKey(robotKey: RobotKey): string {
    return `${robotKey.robotName}-${robotKey.modelName}-${robotKey.userId}`;
  }

  public async writeToHistory(text: string, robotKey: RobotKey) {
    if (!robotKey || typeof robotKey.userId == "undefined") {
      console.log("Robot key set incorrectly");
      return "";
    }
    const key = this.generateRedisRobotKey(robotKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });
    return result;
  }

  public async readLatestHistory(robotKey: RobotKey): Promise<string> {
    if (!robotKey || typeof robotKey.userId == "undefined") {
      console.log("Robot key set incorrectly");
      return "";
    }
    const key = this.generateRedisRobotKey(robotKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });
    result = result?.slice(-30)?.reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    robotKey: RobotKey
  ) {
    const key = this.generateRedisRobotKey(robotKey);
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }
    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
