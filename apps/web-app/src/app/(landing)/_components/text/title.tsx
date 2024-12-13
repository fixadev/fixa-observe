import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export function Title({ children, className = '' }: TitleProps) {
  return (
    <p className={`text-3xl leading-8 font-extrabold tracking-tight text-black lowercase ${className}`}>
      {children}
    </p>
  );
}