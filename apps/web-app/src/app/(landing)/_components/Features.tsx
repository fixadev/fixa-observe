import React from 'react';
import { Wand2, LineChart, Bug, Zap } from 'lucide-react';
import { Heading } from './text/heading';
import { Title } from './text/title';

export function Features() {
  const features = [
    {
      name: 'automated testing',
      description: 'run comprehensive tests on your voice agents to catch issues before they reach production.',
      icon: Wand2,
    },
    {
      name: 'call analytics',
      description: 'deep insights into call patterns, user interactions, and potential failure points.',
      icon: LineChart,
    },
    {
      name: 'bug detection',
      description: 'advanced ai-powered bug detection to identify issues in conversation flows.',
      icon: Bug,
    },
    {
      name: 'real-time fixes',
      description: 'deploy fixes instantly without interrupting your voice agent service.',
      icon: Zap,
    },
  ];

  return (
    <div id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <Heading>features</Heading>
          <Title className="mt-2 sm:text-4xl">
            everything you need for reliable voice agents
          </Title>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto lowercase">
            comprehensive tools to test, monitor, and improve your ai voice agents
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white mb-4">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-black mb-2 lowercase">{feature.name}</h3>
                <p className="text-base text-gray-500 lowercase">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}