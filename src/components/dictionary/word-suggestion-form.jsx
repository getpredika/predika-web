// src/components/dictionary/WordSuggestionForm.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const WordSuggestionForm = ({ isSuggesting, onSuggestWord }) => {
  const [suggestionWord, setSuggestionWord] = useState("");
  const [suggestionDescription, setSuggestionDescription] = useState("");
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestionWord.trim() || suggestionWord.length < 2) {
      addToast({
        title: "Erè",
        description: "Tanpri antre yon sijesyon mo ki valab.",
      });
      return;
    }

    onSuggestWord(suggestionWord, suggestionDescription);
    setSuggestionWord("");
    setSuggestionDescription("");
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Sijere Yon Nouvo Mo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="suggestion-word" className="block text-sm font-medium text-gray-700 mb-1">
            Nouvo Mo
          </label>
          <Input
            id="suggestion-word"
            value={suggestionWord}
            onChange={(e) => setSuggestionWord(e.target.value)}
            placeholder="Antre mo ou ta vle nou ajoute an"
            required
          />
        </div>
        <div>
          <label htmlFor="suggestion-description" className="block text-sm font-medium text-gray-700 mb-1">
            Definisyon mo an
          </label>
          <Textarea
            id="suggestion-description"
            value={suggestionDescription}
            onChange={(e) => setSuggestionDescription(e.target.value)}
            placeholder="Ba nou definisyon mo an"
            rows={3}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSuggesting}>
          {isSuggesting ? "Tann..." : "Sijere"}
        </Button>
      </form>
    </div>
  );
};

export default WordSuggestionForm;
