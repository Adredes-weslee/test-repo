import { ai } from '../core/api/client';
import { API_MODELS, appConfig } from '../config';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { getIndustryTrendsPrompt } from './prompts';
import type { IndustryTrend } from '../types';
import { IndustryTrendsResponseSchema } from '../types/zod';
import { industryTrendsSchema } from './schema';

const getPage = (existingTopicsCount: number, topicsPerPage: number) => {
    if (topicsPerPage === 0) return 0;
    return Math.floor(existingTopicsCount / topicsPerPage);
}

export const fetchIndustryTrends = async (industry: string, count: number, existingTopics: string[], timePeriod: string): Promise<IndustryTrend[]> => {
  const page = getPage(existingTopics.length, count);
  const cacheKey = `${appConfig.STORAGE_KEYS.trendingTrendsCache}_${industry}_${timePeriod}_${page}`;
  
  let rawTrends: IndustryTrend[] = [];
  let isFromCache = false;

  // 1. Try to load from cache
  try {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
          const { trends, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < appConfig.CACHE_DURATIONS.trendingTopics) {
              rawTrends = trends;
              isFromCache = true;
          }
      }
  } catch (error) {
      console.error("Failed to load cached industry trends:", error);
      localStorage.removeItem(cacheKey);
  }

  // 2. If no cache, fetch from API or Mock
  if (!isFromCache) {
      try {
        const prompt = getIndustryTrendsPrompt(industry, count, existingTopics, timePeriod);

        const response = await ai.models.generateContent({
          model: API_MODELS.FETCH_TRENDING_TOPICS, // A fast model is fine for this
          contents: [prompt],
          config: {
            responseMimeType: 'application/json',
            responseSchema: industryTrendsSchema,
          }
        });
        
        const parsedJson = cleanAndParseJson(response.text);
        
        const dataToValidate = Array.isArray(parsedJson)
          ? { trends: parsedJson }
          : (parsedJson && typeof parsedJson === 'object' && 'trends' in parsedJson)
          ? parsedJson
          : { trends: [] };

        const validatedData = IndustryTrendsResponseSchema.parse(dataToValidate);
        
        const expectedPoints = appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig[timePeriod as keyof typeof appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig]?.points || 28;
        validatedData.trends.forEach(trend => {
          if (trend.trendData.length < expectedPoints) {
            const lastValue = trend.trendData.length > 0 ? trend.trendData[trend.trendData.length - 1] : 50;
            const padding = Array(expectedPoints - trend.trendData.length).fill(lastValue);
            trend.trendData = [...trend.trendData, ...padding];
          } else if (trend.trendData.length > expectedPoints) {
            trend.trendData = trend.trendData.slice(0, expectedPoints);
          }
        });

        rawTrends = validatedData.trends;

        // Cache the raw result for this page (before filtering against dynamic existingTopics)
        try {
            const dataToCache = { trends: rawTrends, timestamp: Date.now() };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        } catch (error) {
            console.error("Failed to cache industry trends:", error);
        }
        
      } catch (error) {
        console.error("Error fetching industry trends:", error);
        // Return mock data on failure to avoid a blank screen
        const mockData = [
            { topic: "AI-Powered Code Generation", description: "The rise of models like Copilot and Gemini Code Assist is transforming developer workflows.", detailedDescription: "AI-powered code generation tools are rapidly becoming indispensable for modern software development. By integrating directly into IDEs, they offer real-time suggestions, boilerplate code generation, and even entire function implementations. This trend is driven by massive advancements in large language models, leading to significant productivity gains and allowing developers to focus more on complex problem-solving rather than routine coding tasks. As these tools become more sophisticated, they are poised to fundamentally change how software is created.", trendData: [12, 15, 14, 20, 22, 25, 23, 28, 30, 35, 40, 38, 42, 45, 50, 55, 53, 60, 65, 70, 68, 75, 80, 82, 85, 83, 88, 90], sources: [{web: {uri: "https://example.com/ai-code-gen", title: "The Rise of AI in Development"}}] },
            { topic: "Local LLMs & On-Device AI", description: "Privacy concerns and performance gains are driving the adoption of smaller, powerful models running locally.", detailedDescription: "The push for on-device AI is a direct response to the growing need for privacy, low-latency processing, and offline capabilities. By running smaller, highly optimized large language models (LLMs) directly on user devices like smartphones and laptops, developers can build applications that are faster and more secure, as sensitive data never leaves the device. This trend is enabled by model quantization and distillation techniques, making powerful AI accessible without relying on a constant cloud connection.", trendData: [10, 11, 13, 12, 15, 18, 20, 22, 25, 28, 30, 33, 35, 38, 40, 42, 45, 48, 50, 53, 55, 58, 60, 65, 68, 70, 72, 75], sources: [] },
            { topic: "Retrieval-Augmented Generation (RAG)", description: "RAG is becoming the standard for building LLM applications that can reason over private or real-time data.", detailedDescription: "Retrieval-Augmented Generation (RAG) is a powerful architecture that enhances LLMs by grounding them in external, up-to-date information. Instead of relying solely on its training data, a RAG system first retrieves relevant documents from a knowledge base (like a company's internal wiki or a product's documentation) and then uses that information to generate a more accurate and contextually relevant response. This approach is critical for building enterprise-grade AI applications that can provide reliable answers based on proprietary data.", trendData: [20, 22, 21, 25, 28, 30, 32, 35, 38, 40, 43, 45, 48, 50, 55, 58, 60, 62, 65, 68, 70, 73, 75, 78, 80, 81, 83, 85], sources: [] },
        ];

        const expectedPoints = appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig[timePeriod as keyof typeof appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig]?.points || 28;
        mockData.forEach(trend => {
            if (trend.trendData.length < expectedPoints) {
                const lastValue = trend.trendData.length > 0 ? trend.trendData[trend.trendData.length - 1] : 50;
                const padding = Array(expectedPoints - trend.trendData.length).fill(lastValue);
                trend.trendData = [...trend.trendData, ...padding];
            } else if (trend.trendData.length > expectedPoints) {
                trend.trendData = trend.trendData.slice(0, expectedPoints);
            }
        });
        rawTrends = mockData;
      }
  }

  // 3. Filter and Deduplicate
  // Ensure we don't return topics that are already in existingTopics or duplicates within the current batch.
  const uniqueTrends: IndustryTrend[] = [];
  const seenTopics = new Set(existingTopics.map(t => t.toLowerCase()));

  for (const trend of rawTrends) {
      const topicLower = trend.topic.toLowerCase();
      if (!seenTopics.has(topicLower)) {
          seenTopics.add(topicLower);
          uniqueTrends.push(trend);
      }
  }

  return uniqueTrends;
};