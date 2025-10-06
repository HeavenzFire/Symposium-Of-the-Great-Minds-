import React from 'react';

export const FidelityGauge: React.FC = () => (
  <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs font-medium px-2 py-0.5 rounded-full">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-3.5 w-3.5" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
        clipRule="evenodd" 
      />
    </svg>
    <span>99% Fidelity</span>
  </div>
);