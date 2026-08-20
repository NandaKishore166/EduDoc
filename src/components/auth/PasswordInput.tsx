import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter your password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border p-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
}