import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTimezoneSelect } from "react-timezone-select";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "~/components/ui/select";
import { useScenario } from "./ScenarioContext";

export function AdditionalContextSection() {
  const { options, parseTimezone } = useTimezoneSelect({});
  const [timezone, setTimezone] = useState(
    parseTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone),
  );

  const { scenario, setScenario } = useScenario();

  // Set initial timezone
  useEffect(() => {
    if (scenario) {
      setTimezone(
        parseTimezone(
          scenario.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id]);

  // Update scenario timezone when local timezone changes
  useEffect(() => {
    setScenario((prev) =>
      prev ? { ...prev, timezone: timezone.value } : undefined,
    );
  }, [setScenario, timezone]);

  return (
    <div>
      <Label>context</Label>
      <div className="mb-2 text-sm text-muted-foreground">
        additional context that will be provided to the evaluator
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="current-date-time"
          checked={scenario?.includeDateTime}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(checked) =>
            setScenario((prev) =>
              prev ? { ...prev, includeDateTime: checked } : undefined,
            )
          }
        />
        <Label htmlFor="current-date-time">current date / time</Label>
        <div className="flex-1" />
        <Select
          value={timezone.value}
          onValueChange={(val) => setTimezone(parseTimezone(val))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
