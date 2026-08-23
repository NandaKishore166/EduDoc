import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import { getProjects } from "../services/projectService";
import type { ProjectData } from "../services/projectService";

import { generateAI } from "../services/aiService";

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

  const [projects, setProjects] =
    useState<ProjectData[]>([]);

  const [selectedProjectId, setSelectedProjectId] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const [result, setResult] =
    useState("");

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // Load user's projects
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

        // Automatically select first project
        if (data.length > 0) {
          setSelectedProjectId(
            data[0].id || ""
          );
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

  // Selected project
  const selectedProject =
    projects.find(
      (project) =>
        project.id === selectedProjectId
    );

  // Quick action
  const handleQuickAction = (
    action: string
  ) => {
    setPrompt(action);
  };

  // Generate AI response
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        "Please enter a prompt."
      );
      return;
    }

    if (!selectedProject) {
      toast.error(
        "Please select a project first."
      );
      return;
    }

    try {
      setLoading(true);

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

USER REQUEST:
${prompt}

INSTRUCTIONS:

1. Generate content specifically for the
   project described above.
2. Do not ask the user for project details
   that are already provided.
3. Use formal academic language.
4. Make the response suitable for a B.Tech
   Computer Science project.
5. Keep the content practical and technically
   relevant.
6. Use clear headings and structured points
   where appropriate.
7. Do not invent student names, guide names,
   college names, datasets, results, or
   statistics.
8. If the request requires information that
   is not available, clearly state what is
   missing.
`;

      const response =
        await generateAI(
          projectContext
        );

      setResult(response);

      toast.success(
        "AI response generated!"
      );
    } catch (error: any) {
      console.error(
        "AI Assistant error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to generate AI response."
      );
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-xl font-semibold mb-4">
          Select Project
        </h2>

        {loadingProjects ? (
          <p className="text-gray-500">
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <div className="text-gray-500">
            <p>
              You don't have any projects yet.
            </p>

            <p className="text-sm mt-2">
              Create a project first to use
              project-aware AI assistance.
            </p>
          </div>
        ) : (
          <>
            <select
              value={selectedProjectId}
              onChange={(e) =>
                setSelectedProjectId(
                  e.target.value
                )
              }
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
                <h3 className="font-semibold">
                  {selectedProject.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Domain:{" "}
                  {selectedProject.domain}
                </p>

                <p className="text-sm text-gray-500">
                  Type:{" "}
                  {selectedProject.type}
                </p>

                <p className="text-sm text-gray-500">
                  Guide:{" "}
                  {selectedProject.guide}
                </p>

                <p className="text-sm text-gray-600 mt-3">
                  {selectedProject.description}
                </p>
              </div>
            )}
          </>
        )}
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

      {/* Ask AI */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Ask EduDoc AI
        </h2>

        <textarea
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          placeholder="Ask something about your selected project..."
          className="w-full min-h-[180px] border rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={
              loading ||
              !selectedProject
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
          >
            {loading
              ? "Thinking..."
              : "✨ Ask AI"}
          </button>
        </div>
      </div>

      {/* AI Response */}
      {result && (
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              AI Response
            </h2>

            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(
                  result
                )
              }
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              📋 Copy
            </button>
          </div>

          <div className="whitespace-pre-wrap text-gray-700 leading-7">
            {result}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}