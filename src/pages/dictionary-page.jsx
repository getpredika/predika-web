import Footer from "@/components/footer";
import MainHeader from "@/components/main-header";
import DictionarySecondaryHeader from "@/components/ui/dictionary-secondary-header";
import React, { useState, useEffect } from "react";

function DictionaryPage() {
  const [dictionaryData, setDictionaryData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedDefinition, setSelectedDefinition] = useState(null);


  useEffect(() => {
    fetch("/creole_dictionary.json")
      .then((response) => response.json())
      .then((data) => setDictionaryData(data))
      .catch((error) => console.error("Error loading dictionary:", error));
  }, []);


  useEffect(() => {
    if (searchTerm) {
      const filtered = Object.keys(dictionaryData).filter((word) =>
        word.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWords(filtered);
    } else {
      setFilteredWords([]);
    }
  }, [searchTerm, dictionaryData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedDefinition(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedDefinition(null); 
  };

  const handleWordClick = (word) => {
    setSelectedDefinition(dictionaryData[word]);
  };

  return (
    <div className="min-h-screen bg-[#f0faf7] text-[#2d2d5f] font-sans">
      <MainHeader />
      <DictionarySecondaryHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      
      <main className="max-w-screen-xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-semibold mb-4">Mo</h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {filteredWords.map((word) => (
                <li
                  key={word}
                  onClick={() => handleWordClick(word)}
                  className="cursor-pointer hover:bg-[#40c4a7] p-3 rounded transition-colors"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>

          {selectedDefinition && (
            <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-semibold mb-4">Definisyon</h2>
              <p className="text-lg">{selectedDefinition}</p>
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default DictionaryPage;
