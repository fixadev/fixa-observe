import React from 'react';

interface CustomerLogoProps {
  name: string;
  grayscale?: boolean;
}

export function CustomerLogo({ name, grayscale = false }: CustomerLogoProps) {
  return (
    <div className="col-span-1 flex justify-center items-center">
      <div className="h-12 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-400 lowercase">{name}</p>
      </div>
    </div>
  );
}