import { ai } from '../core/api/client';
import { trendingTopicsSchema } from './schema';
import { API_MODELS, appConfig } from '../config';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { getTrendingTopicsPrompt } from './prompts';
import { TrendingTopicsSchema } from '../types/zod';

const TRENDING_TOPICS_CACHE_PREFIX = 'eliceCreatorAITrendingTopics_';

interface CachedTopics {
  topics: string[];
  timestamp: number;
}

export const fetchTrendingTopics = async (industry: string): Promise<string[]> => {
  //return ['Python Basics', 'Data Science Projects', 'Web Dev Fundamentals', 'Machine Learning'];
  const cacheKey = `${TRENDING_TOPICS_CACHE_PREFIX}${industry}`;
  
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const { topics, timestamp }: CachedTopics = JSON.parse(cachedData);
      if (Date.now() - timestamp < appConfig.CACHE_DURATIONS.trendingTopics) {
        return topics;
      }
    }
  } catch (error) {
    console.error("Failed to load cached trending topics:", error);
    localStorage.removeItem(cacheKey);
  }

  try {
    const prompt = getTrendingTopicsPrompt(industry);

    const response = await ai.models.generateContent({
      model: API_MODELS.FETCH_TRENDING_TOPICS,
      contents: [prompt],
      config: {
        responseMimeType: 'application/json',
        responseSchema: trendingTopicsSchema
      }
    });
    
    const parsedJson = cleanAndParseJson(response.text);
    const validatedData = TrendingTopicsSchema.parse(parsedJson);
    const topics = validatedData.topics;

    try {
      const dataToCache: CachedTopics = { topics, timestamp: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
    } catch (error) {
      console.error("Failed to cache trending topics:", error);
    }
    
    return topics;
    
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return ['Python Basics', 'Data Science Projects', 'Web Dev Fundamentals', 'Machine Learning'];
  }
};