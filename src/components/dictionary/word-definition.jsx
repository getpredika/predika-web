import React from "react";

const WordDefinition = ({ definition }) => {
  // Return early if no definition is provided
  if (!definition) {
    console.warn("No definition provided to WordDefinition component.");
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-lg text-[#6b7280]">
          Tanpri chwazi yon mo pou wè definisyon li.
        </p>
      </div>
    );
  }

  // Destructure definition safely
  const { word, definitionText } = definition;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-semibold mb-4 text-[#2d2d5f]">
        Definisyon: <span className="font-bold">{word || "Pa bay"}</span>
      </h2>
      <p className="text-lg text-[#6b7280]">
        {definitionText || "Pa gen definisyon pou mo sa a."}
      </p>
    </div>
  );
};

export default WordDefinition;
