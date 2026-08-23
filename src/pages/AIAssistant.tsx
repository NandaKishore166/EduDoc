import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import { getProjects } from "../services/projectService";
import type { ProjectData } from "../services/projectService";

import { generateAI } from "../services/aiService";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  "Generate project objectives",
  "Improve my abstract",
  "Generate literature review points",
  "Generate project problem statement",
  "Generate project methodology",
  "Generate project conclusion",
  "Correct grammar and improve academic language",
  "Summarize this content",
];

export default function AIAssistant() {
  const { firebaseUser } = useAuth();

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] =
    useState("");

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [loading, setLoading] = useState(false);

  // Load projects
  useEffect(() => {
    async function loadProjects() {
      if (!firebaseUser) {
        setLoadingProjects(false);
        return;
      }

      try {
        const data = await getProjects(
          firebaseUser.uid
        );

        setProjects(data);

        if (data.length > 0) {
          setSelectedProjectId(data[0].id || "");
        }
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );

        toast.error(
          "Failed to load your projects."
        );
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, [firebaseUser]);

  const selectedProject = projects.find(
    (project) =>
      project.id === selectedProjectId
  );

  // Quick action
  const handleQuickAction = (
    action: string
  ) => {
    setPrompt(action);
  };

  // Ask AI
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        "Please enter a message."
      );
      return;
    }

    if (!selectedProject) {
      toast.error(
        "Please select a project first."
      );
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: prompt.trim(),
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setPrompt("");

    try {
      setLoading(true);

      // Build conversation history
      const conversationHistory =
        updatedMessages
          .map((message) => {
            const speaker =
              message.role === "user"
                ? "Student"
                : "EduDoc AI";

            return `${speaker}: ${message.content}`;
          })
          .join("\n\n");

      const projectContext = `
You are EduDoc AI, an academic documentation
assistant for B.Tech Computer Science students.

CURRENT PROJECT

Project Title:
${selectedProject.title}

Guide:
${selectedProject.guide}

Domain:
${selectedProject.domain}

Project Type:
${selectedProject.type}

Project Description:
${selectedProject.description}

CONVERSATION

${conversationHistory}

INSTRUCTIONS

1. Answer the student's latest request.
2. Use the current project information
   whenever relevant.
3. Remember the previous conversation when
   answering follow-up questions.
4. Do not ask for project information that is
   already provided above.
5. Use formal academic language when
   generating documentation.
6. Make responses suitable for a B.Tech
   Computer Science project.
7. Use clear headings and structured points
   where appropriate.
8. Do not invent student names, guide names,
   college names, datasets, results, or
   statistics.
9. If information is unavailable, clearly
   state what is missing.
10. When the student asks to modify something
    from your previous answer, directly modify
    that content instead of starting over.

Respond to the student's latest message.
`;

      const response =
        await generateAI(projectContext);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error: any) {
      console.error(
        "AI Assistant error:",
        error
      );

      // Remove the unanswered user message
      setMessages(messages);

      toast.error(
        error?.message ||
          "Failed to generate AI response."
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear conversation
  const handleClearChat = () => {
    setMessages([]);
    setPrompt("");

    toast.success(
      "Conversation cleared."
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          AI Assistant
        </h1>

        <p className="text-gray-500 mt-2">
          Your project-aware academic
          documentation assistant.
        </p>
      </div>

      {/* Project Selection */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Current Project
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              AI responses will use this project's
              information.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            disabled={messages.length === 0}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100 disabled:text-gray-400 disabled:bg-gray-100"
          >
            🗑 Clear Chat
          </button>
        </div>

        <div className="mt-4">
          {loadingProjects ? (
            <p className="text-gray-500">
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500">
              Create a project first to use the
              project-aware AI Assistant.
            </p>
          ) : (
            <>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(
                    e.target.value
                  );

                  // Start fresh conversation when
                  // switching projects.
                  setMessages([]);
                }}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.title}
                  </option>
                ))}
              </select>

              {selectedProject && (
                <div className="mt-4 bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg">
                    {selectedProject.title}
                  </h3>

                  <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
                    <div>
                      <span className="font-medium">
                        Domain:
                      </span>{" "}
                      {selectedProject.domain}
                    </div>

                    <div>
                      <span className="font-medium">
                        Type:
                      </span>{" "}
                      {selectedProject.type}
                    </div>

                    <div>
                      <span className="font-medium">
                        Guide:
                      </span>{" "}
                      {selectedProject.guide}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-3">
                    {selectedProject.description}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() =>
                handleQuickAction(action)
              }
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Chat Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            Ask EduDoc AI
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Ask follow-up questions and continue
            the conversation.
          </p>
        </div>

        {/* Messages */}
        <div className="p-6 min-h-[350px] max-h-[600px] overflow-y-auto bg-slate-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="text-5xl mb-4">
                  🤖
                </div>

                <h3 className="text-lg font-semibold">
                  How can I help with your project?
                </h3>

                <p className="text-gray-500 mt-2">
                  Select a quick action or type your
                  own question below.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map(
                (message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border text-gray-800"
                      }`}
                    >
                      <div className="text-xs font-semibold mb-2 opacity-70">
                        {message.role === "user"
                          ? "You"
                          : "EduDoc AI"}
                      </div>

                      <div className="whitespace-pre-wrap leading-7">
                        {message.content}
                      </div>

                      {message.role ===
                        "assistant" && (
                        <button
                          type="button"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              message.content
                            )
                          }
                          className="mt-3 text-xs border rounded px-3 py-1 hover:bg-gray-100"
                        >
                          📋 Copy
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-2xl px-5 py-4 text-gray-500">
                    <span className="animate-pulse">
                      EduDoc AI is thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-5">
          <div className="flex flex-col md:flex-row gap-3">
            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  if (!loading) {
                    handleGenerate();
                  }
                }
              }}
              placeholder="Ask a follow-up question..."
              className="flex-1 min-h-[100px] border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />

            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                loading ||
                !selectedProject ||
                !prompt.trim()
              }
              className="md:self-end bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
            >
              {loading
                ? "Thinking..."
                : "✨ Ask AI"}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Press Enter to send • Shift + Enter
            for a new line
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}