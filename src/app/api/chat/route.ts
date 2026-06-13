import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Supermemory from "supermemory";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, modelPreference, memories: explicitMemories } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const useGemini = modelPreference === "gemini";
    let textResponse = "";
    
    const latestUserMessage = messages[messages.length - 1];

    // Initialize Supermemory and recall relevant past context
    const supermemory = new Supermemory();
    let memoryContext = "";
    try {
      const { results } = await supermemory.search.execute({ 
        q: latestUserMessage.text, 
        containerTag: "memora-user" 
      });
      if (results && results.length > 0) {
        // Collect retrieved texts
        const memories = results.map((r: any) => r.content).join("\n- ");
        memoryContext = `\n\nRelevant past context and memories (from long-term storage):\n- ${memories}`;
      }
    } catch (err) {
      console.error("Supermemory search error:", err);
    }

    let explicitMemoriesContext = "";
    if (explicitMemories && explicitMemories.length > 0) {
      const formattedExplicit = explicitMemories.map((m: any) => `- [${m.category}] ${m.text}`).join("\n");
      explicitMemoriesContext = `\n\nExplicitly Saved User Memories (from active session):\n${formattedExplicit}`;
    }

    const systemPrompt = `You are Memora, an intelligent assistant focused on saving history, tracking memories, and logging decisions for the user. Be concise, helpful, and pay special attention to remembering details the user shares about their life, preferences, and past events. If the user explicitly asks to save something as a memory or remember something specific, append a special tag at the very end of your response exactly like this: [MEMORY: {"text": "the fact to remember", "category": "fact"}] (Valid categories: fact, preference, decision, goal, people, project).${explicitMemoriesContext}${memoryContext}`;

    if (useGemini) {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt 
      });
      
      const formattedMessages = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const history = formattedMessages.slice(0, -1);
      const latestMessage = formattedMessages[formattedMessages.length - 1];

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(latestMessage.parts[0].text);
      textResponse = result.response.text();
    } else {
      const systemMessage = {
        role: "system",
        content: systemPrompt,
      };

      const formattedMessages = messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      const chatCompletion = await groq.chat.completions.create({
        messages: [systemMessage, ...formattedMessages],
        model: "llama-3.1-8b-instant", // upgraded to supported model
      });

      textResponse = chatCompletion.choices[0]?.message?.content || "";
    }

    // Extract memory tag if present
    let extractedMemory = null;
    const memoryRegex = /\[MEMORY:\s*(\{.*?\})\s*\]/is;
    const match = textResponse.match(memoryRegex);
    
    if (match && match[1]) {
      try {
        extractedMemory = JSON.parse(match[1]);
        // Remove the tag from the final response text
        textResponse = textResponse.replace(memoryRegex, "").trim();
      } catch (err) {
        console.error("Failed to parse extracted memory JSON:", err);
      }
    }

    // Persist the user's message asynchronously to Supermemory
    try {
      supermemory.documents.add({
        content: `User: ${latestUserMessage.text}\nMemora: ${textResponse}`,
        containerTag: "memora-user",
      }).catch(err => console.error("Supermemory add error:", err));
    } catch (err) {
      console.error("Failed to initiate Supermemory add:", err);
    }

    return NextResponse.json({
      text: textResponse,
      model: useGemini ? "gemini" : "groq",
      extractedMemory: extractedMemory,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI response" },
      { status: 500 }
    );
  }
}
