import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim()) {
    toast.error("Please enter your email.");
    return;
  }

  try {
    await resetPassword(email);

    toast.success("Password reset email sent!");
  } catch (error: any) {
    toast.error(error.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center">
          Forgot Password
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Enter your email to reset your password.
        </p>

        <form onSubmit={handleReset} className="space-y-5 mt-8">
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full rounded-lg border p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white p-3 hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 font-semibold">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}