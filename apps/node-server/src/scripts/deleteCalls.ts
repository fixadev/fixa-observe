import axios from "axios";
import { db } from "../db";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

async function main() {
  const monoCalls = await db.call.findMany({
    where: {
      ownerId: "11x",
      latencyP50: 0,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  for (const call of monoCalls) {
    const callRecording = call.stereoRecordingUrl;
    if (callRecording) {
      try {
        // Create temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), "temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }

        // Download file to temp location
        const tempFile = path.join(tempDir, `temp_${Date.now()}.wav`);
        const response = await axios({
          method: "GET",
          url: callRecording,
          responseType: "stream",
        });

        await new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(tempFile);
          response.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        // Now analyze the local file
        const { stdout } = await new Promise<{
          stdout: string;
          stderr: string;
        }>((resolve, reject) => {
          exec(
            `ffprobe -v error -select_streams a:0 -show_entries stream=channels -of default=noprint_wrappers=1:nokey=1 "${tempFile}"`,
            (error, stdout, stderr) => {
              if (error) reject(error);
              resolve({ stdout, stderr });
            },
          );
        });

        const channels = parseInt(stdout?.toString().trim() ?? "0");
        console.log(`Recording ${callRecording} has ${channels} channel(s)`);

        // if (channels === 1) {
        //   console.log(`Deleting call ${call.id}`);
        //   await db.call.delete({
        //     where: {
        //       id: call.id,
        //     },
        //   });
        // }

        // Clean up temp file
        fs.unlinkSync(tempFile);
      } catch (error) {
        console.error(`Error analyzing ${callRecording}:`, error);
      }
    }
  }
}

main();
