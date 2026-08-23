import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import { getProject } from "../services/projectService";
import type { ProjectData } from "../services/projectService";

import {
  saveDocument,
  getProjectDocuments,
} from "../services/documentService";
import type { DocumentData } from "../services/documentService";

import { generateAI } from "../services/aiService";

const documentTypes = [
  "Project Proposal",
  "Project Synopsis",
  "SRS Document",
  "Abstract",
];

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { firebaseUser } = useAuth();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  const [selectedType, setSelectedType] =
    useState("Project Proposal");

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Load project and documents
  useEffect(() => {
    async function loadWorkspace() {
      if (!id || !firebaseUser) {
        setLoading(false);
        return;
      }

      try {
        const projectData = await getProject(id);

        setProject(projectData);

        const projectDocuments = await getProjectDocuments(
          id,
          firebaseUser.uid
        );

        setDocuments(projectDocuments);

        // Show existing document of selected type
        const existingDocument = projectDocuments.find(
          (document) => document.type === selectedType
        );

        if (existingDocument) {
          setContent(existingDocument.content);
        } else {
          setContent("");
        }
      } catch (error) {
        console.error("Failed to load workspace:", error);
        toast.error("Failed to load project workspace.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [id, firebaseUser, selectedType]);

  // Generate AI document
  const generateDocument = async () => {
    if (!firebaseUser) {
      toast.error("Please login first.");
      return;
    }

    if (!id) {
      toast.error("Project ID is missing.");
      return;
    }

    if (!project) {
      toast.error("Project information is not available.");
      return;
    }

    try {
      setGenerating(true);

      const prompt = `
You are an academic documentation assistant.

Generate a professional ${selectedType} for the following college project.

Project Title:
${project.title}

Guide:
${project.guide}

Requirements:
- Use formal academic language.
- Make the content suitable for a B.Tech Computer Science project.
- Use clear headings and sections.
- Provide detailed but concise content.
- Do not invent personal information.
- Make the document well structured.

Generate only the ${selectedType}.
`;

      const result = await generateAI(prompt);

      setContent(result);

      await saveDocument(
        id,
        firebaseUser.uid,
        selectedType,
        result
      );

      // Reload documents
      const updatedDocuments = await getProjectDocuments(
        id,
        firebaseUser.uid
      );

      setDocuments(updatedDocuments);

      toast.success(
        `${selectedType} generated successfully!`
      );
    } catch (error: any) {
      console.error(
        "Document generation error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to generate document."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">
            Loading...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Project not found
  if (!project) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold">
            Project Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            The requested project could not be found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Project Workspace
        </h1>

        <p className="text-gray-500 mt-2">
          {project.title}
        </p>

        <p className="text-gray-400 text-sm mt-1">
          Guide: {project.guide}
        </p>
      </div>

      {/* Document type selector */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          AI Documentation Generator
        </h2>

        <div className="flex flex-wrap gap-3">
          {documentTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSelectedType(type);

                const existingDocument =
                  documents.find(
                    (document) =>
                      document.type === type
                  );

                setContent(
                  existingDocument?.content || ""
                );
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                selectedType === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Generator */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedType}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Generate an AI-powered academic document.
            </p>
          </div>

          <button
            type="button"
            onClick={generateDocument}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg transition"
          >
            {generating
              ? "Generating..."
              : "✨ Generate Document"}
          </button>
        </div>

        {/* Document editor */}
        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder={`Your ${selectedType} will appear here...`}
          className="w-full min-h-[500px] border rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
    </DashboardLayout>
  );
}