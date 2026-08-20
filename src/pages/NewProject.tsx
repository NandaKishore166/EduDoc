import { useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { createProject } from "../services/projectService";

export default function NewProject() {
  const { firebaseUser } = useAuth();

  const [title, setTitle] = useState("");
  const [guide, setGuide] = useState("");
  const [domain, setDomain] = useState("AI");
  const [type, setType] = useState("Major Project");
  const [description, setDescription] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firebaseUser) {
      toast.error("Please login first.");
      return;
    }

    if (!title.trim() || !guide.trim()) {
      toast.error("Fill in all fields.");
      return;
    }

    try {
      await createProject({
        title,
        guide,
        domain,
        type,
        description,
        status: "In Progress",
        ownerId: firebaseUser.uid,
      });

      toast.success("Project created successfully!");

      setTitle("");
      setGuide("");
      setDomain("AI");
      setType("Major Project");
      setDescription("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Create New Project
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow space-y-5 max-w-xl"
      >
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Guide Name"
          value={guide}
          onChange={(e) => setGuide(e.target.value)}
        />
<select
  className="w-full border rounded-lg p-3"
  value={domain}
  onChange={(e) => setDomain(e.target.value)}
>
  <option>AI</option>
  <option>Web Development</option>
  <option>Cyber Security</option>
  <option>IoT</option>
  <option>Cloud Computing</option>
  <option>Data Science</option>
  <option>Mobile App</option>
</select>

        <select
          className="w-full border rounded-lg p-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Major Project</option>
          <option>Mini Project</option>
          <option>Research Project</option>
        </select>

        <textarea
          className="w-full border rounded-lg p-3"
          rows={5}
          placeholder="Describe your project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Create Project
        </button>
      </form>
    </DashboardLayout>
  );
}