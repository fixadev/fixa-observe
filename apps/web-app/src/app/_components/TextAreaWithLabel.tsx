import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

interface TextAreaWithLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextAreaWithLabel = ({
  label,
  value,
  onChange,
}: TextAreaWithLabelProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
