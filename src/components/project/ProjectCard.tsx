import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  guide: string;
  domain: string;
  type: string;
  status: string;
}

export default function ProjectCard({
  id,
  title,
  guide,
  domain,
  type,
  status,
}: ProjectCardProps) {
  return (
    <Link to={`/projects/${id}`}>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300 cursor-pointer">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {title}
        </h2>

        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-semibold">🤖 Domain:</span> {domain}
          </p>

          <p>
            <span className="font-semibold">🎓 Type:</span> {type}
          </p>

          <p>
            <span className="font-semibold">👨‍🏫 Guide:</span> {guide}
          </p>
        </div>

        <div className="mt-5">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            {status}
          </span>
        </div>
      </div>
    </Link>
  );
}