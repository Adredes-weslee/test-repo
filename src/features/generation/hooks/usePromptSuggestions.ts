import { useState, useEffect } from 'react';
import { generationService } from '../../../services';
import type { PromptSuggestion } from '../../../types';

const DEBOUNCE_DELAY = 1000; // 1 second

export const usePromptSuggestions = (prompt: string, type: 'course' | 'project') => {
  const [suggestion, setSuggestion] = useState<PromptSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blockNextFetch, setBlockNextFetch] = useState(false);

  useEffect(() => {
    if (blockNextFetch) {
      setBlockNextFetch(false); // Consume the block and prevent this run
      return;
    }

    const trimmedPrompt = prompt.trim();

    // Clear previous suggestion as soon as user types again
    if (suggestion) {
      setSuggestion(null);
    }

    if (trimmedPrompt.length < 10) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Show loading indicator while waiting for debounce
    const handler = setTimeout(async () => {
      try {
        const result = await generationService.getPromptSuggestion(trimmedPrompt, type);
        setSuggestion(result);
      } catch (error) {
        console.error("Failed to fetch prompt suggestion", error);
        setSuggestion(null); // Clear on error
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup function to cancel the timeout if the prompt changes
    return () => {
      clearTimeout(handler);
      setIsLoading(false); // Stop loading indicator if user types again before timeout finishes
    };
  }, [prompt, type]);

  const onSuggestionApplied = () => {
    setSuggestion(null);
    setBlockNextFetch(true);
  };

  return { suggestion, isLoading, onSuggestionApplied };
};