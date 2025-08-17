const WordList = ({ words, onWordClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl text-center font-semibold mb-4">Lis Mo</h2>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {words.map((wordObj) => (
          <li
            key={wordObj.id || wordObj.word}
            onClick={() => onWordClick(wordObj.word)}
            className="cursor-pointer hover:bg-[#40c4a7] hover:text-white p-3 rounded transition-colors"
          >
            {wordObj.word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;
