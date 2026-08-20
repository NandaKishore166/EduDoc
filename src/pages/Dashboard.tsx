import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { firebaseUser } = useAuth();

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg">
            Welcome
          </h3>

          <p className="mt-2 text-slate-600">
            {firebaseUser?.email}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold">
            Projects
          </h3>

          <p className="text-3xl mt-4">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold">
            Documents
          </h3>

          <p className="text-3xl mt-4">
            0
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}