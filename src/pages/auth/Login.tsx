import toast from "react-hot-toast";
import PasswordInput from "../../components/auth/PasswordInput";
import { useState } from "react";
import { loginWithEmail, loginWithGoogle } from "../../firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    toast.error("Please enter both email and password.");
    return;
  }

  try {
    setLoading(true);

    await loginWithEmail(email, password);

    toast.success("Login Successful!");
    navigate("/dashboard");
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};


  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Google Login Successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          EduDoc AI
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5 mt-8">
          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>

            <PasswordInput
  value={password}
  onChange={setPassword}
/>
         <div className="text-right">
<Link
    to="/forgot-password"
    className="text-sm text-blue-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>
         
          </div>

          <button
            className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="my-6 text-center text-slate-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border rounded-lg p-3 hover:bg-slate-100 transition"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}