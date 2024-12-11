import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { type InputProps } from "~/components/ui/input";

interface InputWithLabelProps extends InputProps {
  label: string;
}

export const InputWithLabel = ({
  label,
  className,
  ...props
}: InputWithLabelProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
};
