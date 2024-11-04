// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

export const CardDescription = ({ children, className }) => (
    <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
  );

export const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={`p-4 border-t ${className}`}>{children}</div>
);

export default Card;
