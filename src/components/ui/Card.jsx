import React from 'react';

// Main Card Container
export const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md border border-[#f8fafc] ${className}`}>
    {children}
  </div>
);

// Card Header
export const CardHeader = ({ children, className }) => (
  <div className={`p-4 border-b border-[#f8fafc] bg-[#f0faf7] ${className}`}>
    {children}
  </div>
);

// Card Title
export const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-semibold text-[#2d2d5f] ${className} font-sans`}>{children}</h2>
);

// Card Description
export const CardDescription = ({ children, className }) => (
  <p className={`text-sm text-[#6b7280] ${className} font-sans`}>{children}</p>
);

// Card Content
export const CardContent = ({ children, className }) => (
  <div className={`p-4 text-[#2d2d5f] ${className} font-sans`}>{children}</div>
);

// Card Footer
export const CardFooter = ({ children, className }) => (
  <div className={`p-4 border-t border-[#f8fafc] ${className} bg-[#f0faf7] font-sans`}>{children}</div>
);

export default Card;
