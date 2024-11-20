import Footer from "@/components/footer";
import MainHeader from "@/components/main-header";
import DictionarySecondaryHeader from "@/components/ui/dictionary-secondary-header";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import Toast from "@/components/ui/Toast";
import WordList from "@/components/dictionary/word-list";
import WordDefinition from "@/components/dictionary/word-definition";
import WordSuggestionForm from "@/components/dictionary/word-suggestion-form";
import SEOHelmet from "@/components/seo-helmet.jsx";
import {
  fetchDictionaryWords,
  fetchWordDefinition,
  suggestNewWord,
} from "@/utils/api";

function DictionaryPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [words, setWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceTimeout = useRef(null);

  useEffect(() => {
    const loadWords = async () => {
      setIsLoading(true);
      try {
        const response = await fetchDictionaryWords(page, limit);
        const wordData = response.data.data;
        setWords(wordData || []);
        setTotalPages(Math.ceil(response.data.meta.total / limit));
        setFilteredWords(wordData || []);
      } catch (error) {
        console.error("Error fetching dictionary words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadWords();
  }, [page, limit]);


  useEffect(() => {
    if (searchDebounceTimeout.current) {
      clearTimeout(searchDebounceTimeout.current);
    }

    searchDebounceTimeout.current = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setFilteredWords(words);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetchWordDefinition(searchTerm.trim());
        const definitionText = response.definition; 
        setFilteredWords([
          { word: searchTerm.trim(), definition: definitionText },
        ]);
      } catch (error) {
        console.error("Error searching for word:", error);
        setFilteredWords([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); 

    return () => {
      clearTimeout(searchDebounceTimeout.current);
    };
  }, [searchTerm, words]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedDefinition(null);

    if (value.trim() === "") {
      setFilteredWords(words);
    }
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleWordClick = async (word) => {
    try {
      const response = await fetchWordDefinition(word);
      const definitionText = response.data.definition;
      setSelectedDefinition({ word, definitionText });
    } catch (error) {
      console.error("Error fetching word definition:", error);
    }
  };

  const handleSuggestWord = async (word, description) => {
    setIsSuggesting(true);

    try {
      await suggestNewWord(word, description);
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

  const noResultsFound = filteredWords.length === 0 && searchTerm.trim() !=="";

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
          {!noResultsFound ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WordList words={filteredWords} onWordClick={handleWordClick} />
              <WordDefinition definition={selectedDefinition} />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>
                Pa gen rezilta pou "
                <span className="font-semibold">{searchTerm}</span>".
              </p>
              <p>Ou ka sijere nouvo mo anba a!</p>
              <WordSuggestionForm
                isSuggesting={isSuggesting}
                defaultWord={searchTerm}
                onSuggestWord={handleSuggestWord}
              />
            </div>
          )}

          {/* Pagination Controls */}
          {!searchTerm && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
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
