import { appConfig } from '../../config';

export const getIndustryTrendsPrompt = (industry: string, count: number, existingTopics: string[], timePeriod: string): string => {
    const industryPrompt = industry === 'All'
      ? 'across all major tech industries'
      : `in the ${industry} industry`;
    
    const exclusionPrompt = existingTopics.length > 0
        ? `Do not include any of the following topics, as they have already been shown: ${existingTopics.join(', ')}.`
        : '';

    const periodMap = appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig;
    const config = periodMap[timePeriod as keyof typeof periodMap] || periodMap['4 Weeks'];

    return `You are a market trend analyst for the tech sector. Identify ${count} current, highly trending topics ${industryPrompt}. ${exclusionPrompt} For each topic, provide:
1.  **topic**: The concise name of the topic (e.g., "AI-Powered Code Generation").
2.  **description**: A short, insightful, one-sentence explanation of why it's trending right now.
3.  **detailedDescription**: A more detailed, multi-sentence paragraph (50-70 words) explaining the topic, its significance, and why it's a valuable area of study or development. This should be formatted as a single string.
4.  **trendData**: An array of exactly ${config.points} numbers between 10 and 100 representing the ${config.granularity} trend interest over the last ${timePeriod}. The last number is the most recent data point. The trend should look plausible and not be random noise or a straight line.

Your output MUST be a single, valid JSON object with a single key "trends" which is an array of objects. Each object must contain the keys "topic", "description", "detailedDescription", and "trendData". Do not include any markdown formatting or explanatory text outside of the JSON object. CRITICAL: The "trendData" array for each topic MUST contain exactly ${config.points} numbers.`;
};

export const getTrendDataPrompt = (topic: string, timePeriod: string): string => {
    const periodMap = appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig;
    const config = periodMap[timePeriod as keyof typeof periodMap] || periodMap['1 Year'];

    return `You are a market trend data provider. For the topic "${topic}", provide trend data for the last ${timePeriod}.

Your task is to generate an array of exactly ${config.points} numbers between 10 and 100. This array represents the ${config.granularity} trend interest over the specified period, with the last number being the most recent data point. The trend should look plausible and not be random noise or a straight line.

Your output MUST be a single, valid JSON object with a single key "trendData" containing the array of numbers.`;
};

export const getTopicDetailsPrompt = (topic: string, timePeriod: string): string => {
    return `Provide a detailed analysis for the topic "${topic}", focusing on its relevance over the last ${timePeriod}. Do not introduce yourself, just provide the analysis directly.

Your analysis should be comprehensive, well-structured, and formatted in markdown. Include the following sections:
- **What it is:** A clear, concise definition.
- **Why it's trending now:** Explain the key drivers behind its current popularity (e.g., recent technological breakthroughs, market demand, major company adoption).
- **Key aspects to learn:** A bulleted list of the most important concepts, technologies, or skills related to this topic for someone looking to get into the field.
- **Future outlook:** A brief projection of where this trend is headed.

Use Google Search to ground your response in up-to-date information.`;
};
