// src/components/dictionary/WordDefinition.jsx
import React from "react";

const WordDefinition = ({ definition }) => {
  if (!definition) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-semibold mb-4">
        Definisyon: <span>{definition.word}</span>
      </h2>
      <p className="text-lg">{definition.definition}</p>
    </div>
  );
};

export default WordDefinition;
