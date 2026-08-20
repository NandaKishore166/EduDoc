import { useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import PromptBox from "../components/ai/PromptBox";
import AIResponse from "../components/ai/AIResponse";
import { generateAI } from "../services/aiService";
import { proposalPrompt } from "../prompts/documentPrompts";

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    try {
      setLoading(true);

      const result = await generateAI(proposalPrompt(prompt));

      setResponse(result);
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate document.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <PromptBox
        value={prompt}
        onChange={setPrompt}
        onSubmit={generate}
        loading={loading}
      />

      {response && <AIResponse content={response} />}
    </DashboardLayout>
  );
}