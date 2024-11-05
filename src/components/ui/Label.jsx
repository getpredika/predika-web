import React from 'react';

export const Label = ({ children, className, ...props }) => (
  <label
    className={`block font-medium text-[#6b7280] font-sans mb-2 ${className}`}
    {...props}
  >
    {children}
  </label>
);

export default Label;
