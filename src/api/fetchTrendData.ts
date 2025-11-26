import { ai } from '../core/api/client';
import { trendDataSchema } from './schema';
import { API_MODELS, appConfig } from '../config';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { getTrendDataPrompt } from './prompts';
import { TrendDataSchema } from '../types/zod';

const generateMockData = (points: number): number[] => {
    return Array.from({ length: points }, () => Math.floor(Math.random() * 80) + 10);
};

export const fetchTrendData = async (topic: string, timePeriod: string): Promise<number[]> => {
    const cacheKey = `${appConfig.STORAGE_KEYS.trendingTrendsCache}_data_${topic.replace(/\s+/g, '_')}_${timePeriod.replace(/\s+/g, '_')}`;

    try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { trendData, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < appConfig.CACHE_DURATIONS.trendingTopics) {
                return trendData;
            }
        }
    } catch (error) {
        console.error("Failed to load cached trend data:", error);
        localStorage.removeItem(cacheKey);
    }
    
    try {
        const prompt = getTrendDataPrompt(topic, timePeriod);

        const response = await ai.models.generateContent({
            model: API_MODELS.FETCH_TRENDING_TOPICS,
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: trendDataSchema
            }
        });

        const parsedJson = cleanAndParseJson(response.text);
        const validatedData = TrendDataSchema.parse(parsedJson);
        const trendData = validatedData.trendData;
        
        try {
            const dataToCache = { trendData, timestamp: Date.now() };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        } catch (error) {
            console.error("Failed to cache trend data:", error);
        }

        return trendData;
    } catch (error) {
        console.error(`Error fetching trend data for ${topic} (${timePeriod}):`, error);
        // Return mock data on failure
        const pointMap = appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig;
        return generateMockData(pointMap[timePeriod as keyof typeof pointMap]?.points || 28);
    }
};