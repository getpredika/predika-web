// src/components/dictionary/WordSuggestionForm.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { suggestNewWord } from "@/utils/api";

const WordSuggestionForm = ({
  isSuggesting,
  defaultWord = "",
  onSuggestWord,
}) => {
  const [word, setWord] = useState(defaultWord);
  const [description, setDescription] = useState("");
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!word.trim() || !description.trim()) {
      addToast({
        title: "Champs obligatwa",
        description: "Tou de mo ak deskripsyon yo dwe ranpli.",
      });
      return;
    }

    try {
      await onSuggestWord(word, description);
      addToast({
        title: "Siksè",
        description: "Sijesyon ou an te voye avèk siksè pou revizyon.",
      });
      setWord(""); // Reset word input
      setDescription(""); // Reset description input
    } catch (error) {
      console.error("Error suggesting word:", error);
      addToast({
        title: "Erè",
        description: "Yon erè fèt pandan nap voye sijesyon an. Eseye ankò.",
      });
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
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
            onChange={(e) => setSuggestionWord(e.target.value)}
            placeholder="Antre mo ou ta vle nou ajoute an"
            required
          />
        </div>
        <div>
          <label
            htmlFor="suggestion-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deskripsyon mo an
          </label>
          <Textarea
            id="suggestion-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ba nou deskripsyon mo an"
            rows={3}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 transition-all"
          disabled={
            isSuggesting ||
            !word.trim() ||
            !description.trim()
          }
        >
          {isSuggesting ? "Tann..." : "Sijere"}
        </Button>
      </form>
    </div>
  );
};

export default WordSuggestionForm;
