/**
 * @deprecated This file is deprecated. Use the new API modules:
 * - @/api/auth for authentication
 * - @/api/dictionary for dictionary operations
 * - @/api/quiz for quiz operations
 * - @/api/correction for text correction
 * - @/lib/api-client for audio URL helpers
 * 
 * This file is kept for backward compatibility during migration.
 */

import * as dictionaryApi from "@/api/dictionary";
import * as correctionApi from "@/api/correction";
import { getAudioUrl, getBestAudioUrl } from "@/lib/api-client";

/**
 * @deprecated Use dictionaryApi.listWords() instead
 */
export const fetchDictionaryWords = async (page = 1, limit = 10) => {
  const response = await dictionaryApi.listWords({ page, limit });
  return {
    data: response.data,
    meta: response.meta,
  };
};

/**
 * @deprecated Use dictionaryApi.getWord() instead
 */
export const fetchWordDefinition = async (wordId) => {
  return dictionaryApi.getWord(wordId);
};

/**
 * @deprecated Use dictionaryApi.createWord() instead
 */
export const suggestNewWord = async (word, definition) => {
  return dictionaryApi.createWord({
    word,
    senses: [
      {
        partOfSpeech: "n", // Default part of speech
        definition,
      },
    ],
  });
};

/**
 * @deprecated Use correctionApi.correctText() instead
 */
export const correctText = async (text) => {
  return correctionApi.correctText({ text });
};

/**
 * Helper to get audio URL from CDN
 * @param {string} filename - Audio filename
 * @returns {string|null} Full CDN URL or null
 */
export const getAudioUrl = getAudioUrl;

/**
 * Helper to get best available audio URL
 * @param {object} audio - Audio files object
 * @returns {string|null} Best available audio URL or null
 */
export const getBestAudioUrl = getBestAudioUrl;

