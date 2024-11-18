const BASE_URL = "https://api.predika.app";

export const fetchDictionaryWords = async () => {
  const response = await fetch(`${BASE_URL}/dictionary`, {

    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch dictionary words.");
  }
  return response.json();
};

export const fetchWordDefinition = async (word) => {
  const response = await fetch(`${BASE_URL}/dictionary/${word}`, {

    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Word not found.");
  }
  return response.json();
};

export const suggestNewWord = async (word, description) => {
  const response = await fetch(`${BASE_URL}/dictionary/suggest`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, description }),
  });
  if (!response.ok) {
    throw new Error("Failed to suggest a new word.");
  }
  return response.json();
};
