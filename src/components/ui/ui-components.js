import React from 'react';

export const Slider = ({ min, max, step, value, onValueChange }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseFloat(e.target.value)])}
    className="w-full"
  />
);

export const Input = ({ ...props }) => (
  <input {...props} className="border rounded px-2 py-1" />
);

export const Button = ({ children, ...props }) => (
  <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded">
    {children}
  </button>
);