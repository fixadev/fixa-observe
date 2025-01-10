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
    throw new Error("Failed to get audio duration for url: " + url);
  }
}

export async function getNumberOfAudioChannels(url: string): Promise<number> {
  try {
    // Download only first 64KB which should contain header information
    const { stdout } = await execAsync(
      `curl -sL --range 0-65536 "${url}" | ffprobe -v error -select_streams a:0 -show_entries stream=channels -of csv=p=0 -i pipe:0`,
    );
    return parseInt(stdout.trim());
  } catch (error) {
    console.error("Error getting audio channels:", error);
    throw new Error("Failed to get audio channels for url: " + url);
  }
}
