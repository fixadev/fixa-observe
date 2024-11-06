import type { Call } from "~/lib/types";
import AudioPlayer from "./AudioPlayer";

export default function CallDetails({ call }: { call: Call }) {
  return (
    <div className="w-full p-4">
      <AudioPlayer call={call} />
    </div>
  );
}
