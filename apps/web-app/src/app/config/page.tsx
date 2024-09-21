import { Input } from "~/components/ui/input";

export default function ConfigPage() {
  return (
    <div>
      <div>config</div>
      <div>outcomes</div>
      <div className="flex items-center gap-2">
        <Input
          autoComplete="off"
          placeholder="name"
          className="w-1/3 flex-auto"
        />
        <Input
          autoComplete="off"
          placeholder="description"
          className="w-2/3 flex-auto"
        />
      </div>
    </div>
  );
}
