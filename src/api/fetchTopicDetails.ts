
import { ai } from '../core/api/client';
import { API_MODELS, appConfig } from '../config';
import { getTopicDetailsPrompt } from './prompts';
import type { IndustryTrend } from '../types';

export const fetchTopicDetails = async (topic: string, timePeriod: string): Promise<Pick<IndustryTrend, 'detailedDescription' | 'sources'>> => {
  const cacheKey = `${appConfig.STORAGE_KEYS.trendingTopicDetailsCache}_${topic.replace(/\s+/g, '_')}_${timePeriod.replace(/\s+/g, '_')}`;

  try {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
          const { details, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < appConfig.CACHE_DURATIONS.trendingTopics) {
              return details;
          }
      }
  } catch (error) {
      console.error("Failed to load cached topic details:", error);
      localStorage.removeItem(cacheKey);
  }

  try {
    const prompt = getTopicDetailsPrompt(topic, timePeriod);

    const response = await ai.models.generateContent({
      model: API_MODELS.FETCH_TRENDING_TOPICS, // A fast model is fine
      contents: [prompt],
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const detailedDescription = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources = groundingChunks
      .filter(chunk => chunk.web?.uri && chunk.web?.title)
      .map(chunk => ({
        web: {
          uri: chunk.web!.uri!,
          title: chunk.web!.title!,
        },
      }));

    const details = {
      detailedDescription,
      sources,
    };

    try {
        const dataToCache = { details, timestamp: Date.now() };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
    } catch (error) {
        console.error("Failed to cache topic details:", error);
    }

    return details;
  } catch (error) {
    console.error(`Error fetching details for topic "${topic}":`, error);
    throw error;
  }
};
