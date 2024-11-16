import Footer from "@/components/footer";
import MainHeader from "@/components/main-header";
import DictionarySecondaryHeader from "@/components/ui/dictionary-secondary-header";
import  { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Toast from "@/components/ui/Toast";
import WordList from "@/components/dictionary/word-list";
import WordDefinition from "@/components/dictionary/word-definition";
import WordSuggestionForm from "@/components/dictionary/word-suggestion-form";
import SEOHelmet from "@/components/seo-helmet.jsx";

function DictionaryPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [dictionaryData, setDictionaryData] = useState({});
  const [searchTerm, setSearchTerm] = useState("a");
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    fetch("/creole_dictionary.json")
      .then((response) => response.json())
      .then((data) => {
        setDictionaryData(data);
        const words = Object.keys(data);
        if (words.length > 0) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          setSelectedDefinition({
            word: randomWord,
            definition: data[randomWord],
          });
        }
      })
      .catch((error) => console.error("Erè chajman diksyonè a:", error));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = Object.keys(dictionaryData).filter((word) =>
        word.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWords(filtered.slice(0, 7));
    } else {
      setFilteredWords(Object.keys(dictionaryData).slice(0, 7));
    }
  }, [searchTerm, dictionaryData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedDefinition(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleWordClick = (word) => {
    setSelectedDefinition({ word, definition: dictionaryData[word] });
  };

  const handleSuggestWord = async (word, description) => {
    setIsSuggesting(true);

    try {
      addToast({

        title: "Mo Sijere",
        description: `Mèsi paske ou sijere "${word}". Ekip nou an pral revize li.`,
      });
    } catch (error) {
      addToast({
        title: "Erè",
        description: "Te gen yon pwoblèm pandan nou te ap voye sijesyon ou a.",

      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const noResultsFound = filteredWords.length === 0;

  return (
      <>
        <SEOHelmet
            title="Diksyonè Kreyòl - Predika"
            description="Jwenn definisyon mo an Kreyòl ak zouti koreksyon entèlijans atifisyèl nan Diksyonè Kreyòl Predika."
            keywords="Diksyonè Kreyòl, Definisyon Mo Kreyòl, Koreksyon Tèks Kreyòl"
            imageUrl="https://predika.app/public/predika-logo.png"
            url="https://predika.app/diksyonè"
        />

        <div className="min-h-screen bg-[#f0faf7] text-[#2d2d5f] font-sans">
          <MainHeader />
          <DictionarySecondaryHeader
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
          />

          <main className="max-w-screen-xl mx-auto p-6">
            {!noResultsFound && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WordList words={filteredWords} onWordClick={handleWordClick} />
                <WordDefinition definition={selectedDefinition} />
              </div>
            )}

            {noResultsFound && (
              <WordSuggestionForm
                isSuggesting={isSuggesting}
                onSuggestWord={handleSuggestWord}
              />
            )}

            {/* Render Toasts */}
            <div className="fixed bottom-4 right-4 z-50">
              {toasts.map((toast) => (
                <Toast
                  key={toast.id}
                  id={toast.id}
                  title={toast.title}
                  description={toast.description}
                  onClose={removeToast}
                />
              ))}
            </div>
          </main>
          <Footer />
        </div>
      </>
  );
}

export default DictionaryPage;
