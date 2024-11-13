// src/components/dictionary/WordList.jsx
import React from "react";

const WordList = ({ words, onWordClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-semibold mb-4">List Mo</h2>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {words.map((word) => (
          <li
            key={word}
            onClick={() => onWordClick(word)}
            className="cursor-pointer hover:bg-[#40c4a7] p-3 rounded transition-colors"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;
