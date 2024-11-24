import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

const WordSuggestionForm = ({
  isSuggesting,
  defaultWord = "",
  onSuggestWord,
}) => {
  const [word, setWord] = useState(defaultWord);
  const [definition, setDefinition] = useState("");
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!word.trim() || !definition.trim()) {
      addToast({
        title: "Fòm obligatwa",
        description: "Tou mo ak definisyon yo dwe ranpli.",
      });
      return;
    }

    try {
      await onSuggestWord(word, definition);
      addToast({
        title: "Siksè",
        description: "Sijesyon ou an te voye avèk siksè pou revizyon.",
      });
      setWord("");
      setDefinition("");
    } catch (error) {
      console.error("Error suggesting word:", error);
      addToast({
        title: "Erè",
        description: "Yon erè fèt pandan nap voye sijesyon an. Eseye ankò.",
      });
    }
  };

  useEffect(() => {
    setWord(defaultWord);
  }, [defaultWord]);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-[#2d2d5f]">
        Sijere Yon Nouvo Mo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="suggestion-word"
            className="block text-sm font-medium text-[#6b7280] mb-1"
          >
            Nouvo Mo
          </label>
          <Input
            id="suggestion-word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Antre mo ou ta vle nou ajoute an"
            required
          />
        </div>
        <div>
          <label
            htmlFor="suggestion-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Definisyon mo an
          </label>
          <Textarea
            id="suggestion-description"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Ba nou definisyon mo an"
            rows={3}
          />
        </div>
        <Button
          type="submit"
          className={`w-full px-4 py-2 font-medium text-white transition-all rounded-md ${
            isSuggesting || !word.trim() || !definition.trim()
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#40c4a7] hover:bg-[#40c4a7]/90 focus:ring-2 focus:ring-[#40c4a7] focus:ring-offset-2"
          }`}
          disabled={isSuggesting || !word.trim() || !definition.trim()}
        >
          {isSuggesting ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Tann...
            </div>
          ) : (
            "Sijere"
          )}
        </Button>
      </form>
    </div>
  );
};

export default WordSuggestionForm;
