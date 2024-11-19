const BASE_URL = "https://api.predika.app";

export const fetchDictionaryWords = async () => {
  const response = await fetch(`${BASE_URL}/dictionary`, {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export const fetchWordDefinition = async (word) => {
  const response = await fetch(`${BASE_URL}/dictionary/${word}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export const suggestNewWord = async (word, description) => {
  const response = await fetch(`${BASE_URL}/dictionary/suggest`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word, description }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};


export const correctText = async (text) => {
  const response = await fetch(`${BASE_URL}/api/correct`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
}
