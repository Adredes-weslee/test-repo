import { appConfig } from '../../config';

export const getTrendingTopicsPrompt = (industry: string): string => {
    const industryPrompt = industry === 'All'
      ? 'in any industry'
      : `in the ${industry} industry`;

    return `As an expert curriculum strategist, identify ${appConfig.UI_SETTINGS.trendingTopicsCount} trending, in-demand topics ${industryPrompt}. These topics should be specific and actionable, perfect for new courses. Focus on concrete technologies, GitHub libraries, HuggingFace models, programming concepts, frameworks, or advanced techniques. For example, instead of a broad topic like "React", suggest a specific one like "Advanced React Patterns". Each topic must be concise, with a maximum of 4 words. Good examples include: "LangChain for LLM Apps", "Serverless Architecture", "Fine-tuning LLMs".`;
};
