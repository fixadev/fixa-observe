import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getAudioDuration(url: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v quiet -print_format json -show_format "${url}"`,
    );
    const metadata = JSON.parse(stdout);
    return Math.round(parseFloat(metadata.format.duration) * 100) / 100;
  } catch (error) {
    console.error("Error getting audio duration:", error);
    throw new Error("Failed to get audio duration");
  }
}
