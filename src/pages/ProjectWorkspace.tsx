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
  updateDocument,
  deleteDocument,
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

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<string | null>(null);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

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

        const projectDocuments =
          await getProjectDocuments(
            id,
            firebaseUser.uid
          );

        setDocuments(projectDocuments);

        const existingDocument =
          projectDocuments.find(
            (document) =>
              document.type === selectedType
          );

        if (existingDocument) {
          setSelectedDocumentId(
            existingDocument.id || null
          );

          setContent(existingDocument.content);
        } else {
          setSelectedDocumentId(null);
          setContent("");
        }
      } catch (error) {
        console.error(
          "Failed to load workspace:",
          error
        );

        toast.error(
          "Failed to load project workspace."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [id, firebaseUser, selectedType]);

  // Select document type
  const handleDocumentTypeChange = (
    type: string
  ) => {
    setSelectedType(type);

    const existingDocument =
      documents.find(
        (document) => document.type === type
      );

    if (existingDocument) {
      setSelectedDocumentId(
        existingDocument.id || null
      );

      setContent(existingDocument.content);
    } else {
      setSelectedDocumentId(null);
      setContent("");
    }
  };

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
      toast.error(
        "Project information is not available."
      );
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

Domain:
${project.domain}

Project Type:
${project.type}

Project Description:
${project.description}

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

      /*
       * If a document of this type already exists,
       * update it instead of creating duplicates.
       */
      const existingDocument =
        documents.find(
          (document) =>
            document.type === selectedType
        );

      if (existingDocument?.id) {
        await updateDocument(
          existingDocument.id,
          result
        );

        setSelectedDocumentId(
          existingDocument.id
        );
      } else {
        await saveDocument(
          id,
          firebaseUser.uid,
          selectedType,
          result
        );
      }

      const updatedDocuments =
        await getProjectDocuments(
          id,
          firebaseUser.uid
        );

      setDocuments(updatedDocuments);

      const updatedDocument =
        updatedDocuments.find(
          (document) =>
            document.type === selectedType
        );

      setSelectedDocumentId(
        updatedDocument?.id || null
      );

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

  // Save manually edited document
  const handleSave = async () => {
    if (!firebaseUser) {
      toast.error("Please login first.");
      return;
    }

    if (!selectedDocumentId) {
      toast.error(
        "Generate the document first before saving."
      );
      return;
    }

    try {
      setSaving(true);

      await updateDocument(
        selectedDocumentId,
        content
      );

      const updatedDocuments =
        await getProjectDocuments(
          id!,
          firebaseUser.uid
        );

      setDocuments(updatedDocuments);

      toast.success(
        "Document saved successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to save document:",
        error
      );

      toast.error(
        "Failed to save document."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete selected document
  const handleDelete = async () => {
    if (!selectedDocumentId) {
      toast.error("No saved document selected.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedType}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDocument(
        selectedDocumentId
      );

      const updatedDocuments =
        await getProjectDocuments(
          id!,
          firebaseUser!.uid
        );

      setDocuments(updatedDocuments);
      setSelectedDocumentId(null);
      setContent("");

      toast.success(
        "Document deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete document:",
        error
      );

      toast.error(
        "Failed to delete document."
      );
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
            The requested project could not be
            found.
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
              onClick={() =>
                handleDocumentTypeChange(type)
              }
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

      {/* Generator and editor */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedType}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Generate, edit, and save your academic
              document.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
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

            <button
              type="button"
              onClick={handleSave}
              disabled={
                saving || !selectedDocumentId
              }
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg transition"
            >
              {saving
                ? "Saving..."
                : "💾 Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={!selectedDocumentId}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg transition"
            >
              🗑 Delete
            </button>
          </div>
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

      {/* Saved documents */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Saved Documents
        </h2>

        {documents.length === 0 ? (
          <p className="text-gray-500">
            No documents have been generated yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((document) => (
              <button
                key={document.id}
                type="button"
                onClick={() => {
                  setSelectedType(
                    document.type
                  );
                  setSelectedDocumentId(
                    document.id || null
                  );
                  setContent(
                    document.content
                  );
                }}
                className={`text-left border rounded-xl p-4 transition ${
                  selectedDocumentId ===
                  document.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <h3 className="font-semibold">
                  {document.type}
                </h3>

                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {document.content}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}