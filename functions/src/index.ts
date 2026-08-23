import { setGlobalOptions } from "firebase-functions";
import { onCall, HttpsError } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenAI } from "@google/genai";

setGlobalOptions({
  maxInstances: 10,
});

const geminiApiKey = defineSecret("GEMINI_API_KEY");

export const generateAI = onCall(
  {
    secrets: [geminiApiKey],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be logged in to use the AI assistant."
      );
    }

    const prompt = request.data?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new HttpsError(
        "invalid-argument",
        "A valid prompt is required."
      );
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: geminiApiKey.value(),
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return {
        text: response.text ?? "",
      };
    } catch (error) {
      console.error("Gemini generation failed:", error);

      throw new HttpsError(
        "internal",
        "Failed to generate AI content."
      );
    }
  }
);