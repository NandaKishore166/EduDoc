import { onRequest } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const generateDocument = onRequest(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({
        error: "Prompt is required.",
      });
      return;
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      text: result.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate content.",
    });
  }
});