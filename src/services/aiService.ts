import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
} from "firebase/ai";

import { app } from "../firebase/config";

const ai = getAI(app, {
  backend: new GoogleAIBackend(),
});

const model = getGenerativeModel(ai, {
  model: "gemini-3.6-flash",
});

export async function generateAI(prompt: string) {
  if (!prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  try {
    console.log("Sending prompt to Firebase AI Logic...");

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log("AI response received.");

    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    return text;
  } catch (error) {
    console.error("========== FIREBASE AI ERROR ==========");
    console.error(error);
    console.error("=======================================");

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown Firebase AI error.");
  }
}