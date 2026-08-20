interface Props {
  content: string;
}

export default function AIResponse({ content }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Generated Document
      </h2>

      <pre className="whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}