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
  const [description, setDescription] = useState("");
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (!user) {
      navigate("/koneksyon", { state: { from: "/diksyonè" } });
      return;
    }

    if (!word.trim() || !description.trim()) {
      addToast({
        title: "Fòm obligatwa",
        description: "Tou mo ak definisyon yo dwe ranpli.",
      });
      return;
    }

    try {
      await onSuggestWord(word, description);
      addToast({
        title: "Siksè",
        description: "Sijesyon ou an te voye avèk siksè pou revizyon.",
      });
      setWord("");
      setDescription("");
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ba nou definisyon mo an"
            rows={3}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 transition-all"
          disabled={isSuggesting || !word.trim() || !description.trim()}
        >
          {isSuggesting ? "Tann..." : "Sijere"}
        </Button>
      </form>
    </div>
  );
};

export default WordSuggestionForm;
