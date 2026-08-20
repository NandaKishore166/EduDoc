interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function PromptBox({
  value,
  onChange,
  onSubmit,
  loading,
}: PromptBoxProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <textarea
        rows={8}
        className="w-full border rounded-lg p-3"
        placeholder="Describe your project..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        onClick={onSubmit}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Document"}
      </button>
    </div>
  );
}