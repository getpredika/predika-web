// src/components/ui/input.jsx
import React from 'react';

export const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-4 py-2 border border-lightGray rounded-md 
      text-mainText bg-white placeholder:text-bodyText 
      focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent 
      transition duration-200 ease-in-out ${className}`}
    {...props}
  />
);

export default Input;
