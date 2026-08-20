import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ProjectCard from "../components/project/ProjectCard";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../services/projectService";
import type { ProjectData } from "../services/projectService";

export default function Projects() {
  const { firebaseUser } = useAuth();

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (!firebaseUser) return;

      const data = await getProjects(firebaseUser.uid);

      setProjects(data);
      setLoading(false);
    }

    loadProjects();
  }, [firebaseUser]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          My Projects
        </h1>

        <Link
          to="/projects/new"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + New Project
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold">
            No Projects Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first project.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
  key={project.id}
  id={project.id!}
  title={project.title}
  guide={project.guide}
  domain={project.domain}
  type={project.type}
  status={project.status}
/>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}