import { openai } from "@ai-sdk/openai";
import { Message, streamText } from "ai";

type RequestData = {
  messages: Message[];
};

export async function POST(req: Request) {
  const { messages }: RequestData = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
