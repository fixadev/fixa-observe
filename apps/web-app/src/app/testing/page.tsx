"use client";
import { useState } from "react";
import { VideoPlayer } from "~/components/VideoPlayer";

export default function TestingPage() {
  const [HLSUrls, setHLSUrls] = useState<Array<string> | null>(null);
  const [renderer, setRenderer] = useState<string>("opengl");
  const [numPrompts, setNumPrompts] = useState<number>(1);

  const prompts = [
    "how does a webserver work",
    "how does a webserver work",
    "how does a webserver work",
    "how does a webserver work",
    "explain riemann sums",
    "explain riemann sums",
    "explain riemann sums",
    "explain riemann sums",
    "create a graph to the moon",
    "create a graph to the moon",
    "create a graph to the moon",
    "create a graph to the moon",
    "how are babies made",
    "how are babies made",
    "how are babies made",
    "how are babies made",
    "how do blockchains works",
    "how do blockchains works",
    "how do blockchains works",
    "how do blockchains works",
    "how do transformers in LLMs work",
    "how do transformers in LLMs work",
    "how do transformers in LLMs work",
    "how do transformers in LLMs work",
    "what is a graph in computer science",
    "what is a graph in computer science",
    "what is a graph in computer science",
    "what is a graph in computer science",
    "visualize 2x2 matrix multiplication step-by-step",
    "visualize 2x2 matrix multiplication step-by-step",
    "visualize 2x2 matrix multiplication step-by-step",
    "visualize 2x2 matrix multiplication step-by-step",
    "illustrate the doppler effect with sound waves",
    "illustrate the doppler effect with sound waves",
    "illustrate the doppler effect with sound waves",
    "illustrate the doppler effect with sound waves",
    "animate the process of how the water cycle works",
    "animate the process of how the water cycle works",
    "animate the process of how the water cycle works",
    "animate the process of how the water cycle works",
    "show the formation and lifecycle of a star in space",
    "show the formation and lifecycle of a star in space",
    "show the formation and lifecycle of a star in space",
    "show the formation and lifecycle of a star in space",
  ];

  const runTest = async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate`;
    console.log(endpoint);
    const responses = await Promise.all(
      prompts.slice(0, numPrompts).map(async (prompt) => {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt, renderer: renderer }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as { hls_playlist_url: string };

        if (!data.hls_playlist_url) {
          throw new Error("No HLS playlist URL in the response");
        }
        return data.hls_playlist_url;
      }),
    );
    setHLSUrls(responses);
  };

  const showCode = (url: string) => {
    url = url.replace("playlist.m3u8", "log.txt");
    window.open(url, "_blank");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-row gap-4">
        <button
          onClick={runTest}
          className="rounded-md bg-blue-500 p-2 text-white"
        >
          Run Test
        </button>
        <select
          value={renderer}
          onChange={(e) => setRenderer(e.target.value)}
          className="rounded-md bg-blue-500 p-2 text-white"
        >
          <option value="opengl">OpenGL</option>
          <option value="cairo">Cairo</option>
        </select>
        <select
          value={numPrompts}
          onChange={(e) => setNumPrompts(Number(e.target.value))}
          className="rounded-md bg-blue-500 p-2 text-white"
        >
          {Array.from({ length: 30 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="grid h-4/5 w-full grid-cols-4 gap-4 overflow-auto">
        {HLSUrls?.map((url) => (
          <div key={url} className="aspect-video">
            <button onClick={() => showCode(url)}>Show Code</button>
            <VideoPlayer key={url} hls_playlist_url={url} />
          </div>
        ))}
      </div>
    </div>
  );
}
