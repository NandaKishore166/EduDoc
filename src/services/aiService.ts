const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

export async function generateAI(prompt: string) {
  const response = await fetch(
    "https://gemini.googleapis.com/v1/models/gemini-2.5-flash:generateText",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          text: prompt,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content ?? "";
}