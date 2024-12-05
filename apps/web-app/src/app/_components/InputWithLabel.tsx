import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface InputWithLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const InputWithLabel = ({
  label,
  value,
  onChange,
  className,
}: InputWithLabelProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
