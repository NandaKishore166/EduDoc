import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ProjectWorkspace() {
  const { projectId } = useParams();

  const modules = [
    "Proposal",
    "Synopsis",
    "SRS",
    "Project Report",
    "PPT",
    "Viva Questions",
    "Timeline",
    "AI Assistant",
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Project Workspace
      </h1>

      <p className="text-gray-500 mb-8">
        Project ID: {projectId}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <div
            key={module}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="font-semibold text-lg">
              {module}
            </h2>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}