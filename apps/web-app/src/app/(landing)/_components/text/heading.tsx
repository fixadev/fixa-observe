import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading({ children, className = "" }: HeadingProps) {
  return (
    <h2
      className={`text-base font-semibold uppercase tracking-wide text-black ${className}`}
    >
      {children}
    </h2>
  );
}
