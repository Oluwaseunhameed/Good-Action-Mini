// app/api/generateSummary/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const { programData } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const prompt = `Provide an impact summary for the following program data: ${JSON.stringify(
    programData
  )}`;

  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
  });

  // Adjust accessing the summary based on the new response structure.
  const summary = response.choices[0].text?.trim();

  return NextResponse.json({ summary });
}
