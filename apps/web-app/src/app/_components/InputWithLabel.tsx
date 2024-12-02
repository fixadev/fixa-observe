import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface InputWithLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const InputWithLabel = ({
  label,
  value,
  onChange,
}: InputWithLabelProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
