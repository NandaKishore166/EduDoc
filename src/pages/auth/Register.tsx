import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import PasswordInput from "../../components/auth/PasswordInput";
import { register } from "../../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(name, email, password);

      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Join EduDoc AI
        </p>

        <form onSubmit={handleRegister} className="space-y-5 mt-8">
          <div>
            <label className="block mb-2">Full Name</label>

            <input
              className="w-full rounded-lg border p-3"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Email</label>

            <input
              type="email"
              className="w-full rounded-lg border p-3"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Password</label>

            <PasswordInput
              value={password}
              onChange={setPassword}
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white p-3 hover:bg-blue-700"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}