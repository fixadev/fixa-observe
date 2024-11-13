interface SuggestedChangeProps {
  removed: string[];
  added: string[];
  title?: string;
}

export function SuggestedChange({
  removed,
  added,
  title = "suggested change",
}: SuggestedChangeProps) {
  return (
    <div className="rounded-md border border-input bg-background p-4 text-sm shadow-sm">
      <h3 className="mb-4 font-medium">{title}</h3>

      <div className="rounded-md bg-gray-50">
        {removed.map((line, index) => (
          <div
            key={`removed-${index}`}
            className="flex gap-4 bg-red-100 px-4 py-1"
          >
            <span className="text-red-700">-</span>
            <span>{line}</span>
          </div>
        ))}

        {added.map((line, index) => (
          <div
            key={`added-${index}`}
            className="flex gap-4 bg-green-100 px-4 py-1"
          >
            <span className="text-green-700">+</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
