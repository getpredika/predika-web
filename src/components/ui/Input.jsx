// src/components/ui/input.jsx
import React from 'react';

export const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-4 py-2 border border-[#ddd] rounded-md 
      text-[#2d2d5f] bg-white placeholder:text-[#6b7280] 
      focus:outline-none focus:border-[#40c4a7] focus:ring-1 focus:ring-[#40c4a7] 
      transition duration-200 ease-in-out font-sans ${className}`}
    {...props}
  />
);
export default Input;
