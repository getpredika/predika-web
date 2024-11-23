import { useState, useEffect } from "react";
import { fetchDictionaryWords, fetchWordDefinition } from "@/utils/api";

export const useDictionary = (page, limit, searchTerm) => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadWords = async () => {
      setIsLoading(true);
      try {
        const response = await fetchDictionaryWords(page, limit);
        const wordData = response.data.data;

        setWords(wordData || []);
        setTotalPages(Math.ceil(response.data.meta.total / limit));
        if (!searchTerm.trim()) {
          setFilteredWords(wordData || []);
        }
      } catch (error) {
        console.error("Error fetching dictionary words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadWords();
  }, [page, limit]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const fetchFilteredWords = async () => {
        try {
          const response = await fetchWordDefinition(searchTerm.trim());
          setFilteredWords([{ word: searchTerm.trim(), definition: response.definition }]);
        } catch (error) {
          console.error("Search error:", error);
          setFilteredWords([]);
        } finally {
          setIsSearching(false);
        }
      };
      fetchFilteredWords();
    } else {
      setFilteredWords(words);
    }
  }, [searchTerm, words]);

  return { words, filteredWords, isLoading, isSearching, totalPages };
};
