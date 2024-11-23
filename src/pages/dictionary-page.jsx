import Footer from "@/components/footer";
import MainHeader from "@/components/main-header";
import DictionarySecondaryHeader from "@/components/ui/dictionary-secondary-header";
import { useState, useEffect, useRef } from "react";
import Pagination from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import Toast from "@/components/ui/Toast";
import WordList from "@/components/dictionary/word-list";
import WordDefinition from "@/components/dictionary/word-definition";
import WordSuggestionForm from "@/components/dictionary/word-suggestion-form";
import SEOHelmet from "@/components/seo-helmet.jsx";
import { fetchWordDefinition, suggestNewWord } from "@/utils/api";
import { useDictionary } from "@/hooks/use-dictionary";
import { useDebounce } from "@/hooks/use-debounce";

function DictionaryPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { words, filteredWords, isLoading, isSearching, totalPages } =
    useDictionary(page, 7, debouncedSearchTerm);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleWordClick = async (word) => {
    try {
      const response = await fetchWordDefinition(word);

      if (response.data.definition === null) {
        setSelectedDefinition({
          word,
          definitionText: (
            <div>
              Nou pa jwenn mo sa a nan diksyonè a. Ou vle <br />
              <button
                onClick={() => setIsSuggesting(true)}
                className="text-blue-500 underline"
              >
                sijere mo a?
              </button>
            </div>
          ),
        });
      } else {
        setSelectedDefinition({
          word,
          definitionText: response.data.definition,
        });
      }
    } catch (error) {
      console.error("Error fetching word definition:", error);
      addToast({
        title: "Erè",
        description: "Nou pa ka jwenn definisyon mo a kounye a.",
      });
      setSelectedDefinition(null);
    }
  };

  const validateInputs = (word, description) => {
    if (!word || word.trim() === "") throw new Error("Mo pa ka vid.");
    if (word.length > 50) throw new Error("Mo a twò long (50 karaktè max).");
    if (!description || description.trim() === "")
      throw new Error("Deskripsyon pa ka vid.");
    if (description.length > 300)
      throw new Error("Deskripsyon twò long (300 karaktè max).");
  };

  const handleSuggestWord = async (word, definition) => {
    try {
      validateInputs(word, definition);
      if (!word.trim() || !definition.trim()) {
        throw new Error("Mo ak deskripsyon yo dwe ranpli.");
      }

      await suggestNewWord(word, definition);
      addToast({
        title: "Mo Sijere",
        description: `Mèsi paske ou sijere "${word}". Ekip nou an pral revize li.`,
      });
    } catch (error) {
      addToast({
        title: "Erè",
        description:
          error.message ||
          "Te gen yon pwoblèm pandan nou te ap voye sijesyon ou a.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const noResultsFound =
    !isLoading && filteredWords.length === 0 && searchTerm.trim() !== "";

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
          {isSuggesting ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Sijere yon nouvo mo
              </h2>
              <WordSuggestionForm
                isSuggesting={isSuggesting}
                defaultWord={selectedDefinition?.word || ""}
                onSuggestWord={handleSuggestWord}
              />
              <button
                onClick={() => setIsSuggesting(false)}
                className="mt-4 block mx-auto text-blue-500 underline"
              >
                Tounen nan diksyonè a
              </button>
            </div>
          ) : (
            <>
              {isLoading || isSearching ? (
                <div className="text-center">
                  <p>Chaje...</p>
                </div>
              ) : noResultsFound ? (
                <div className="text-center text-gray-500">
                  <p>
                    Pa gen rezilta pou "
                    <span className="font-semibold">{searchTerm}</span>". Ou ka
                    sijere nouvo mo anba a!
                  </p>
                  <button
                    onClick={() => setIsSuggesting(true)}
                    className="text-blue-500 underline"
                  >
                    Sijere yon mo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <WordList
                    words={filteredWords}
                    onWordClick={handleWordClick}
                  />
                  <WordDefinition definition={selectedDefinition} />
                </div>
              )}

              {/* Pagination Controls */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default DictionaryPage;
