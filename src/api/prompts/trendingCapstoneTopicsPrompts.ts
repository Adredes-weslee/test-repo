import { appConfig } from '../../config';

export const getTrendingCapstoneTopicsPrompt = (industry: string): string => {
    const industryPrompt = industry === 'All'
      ? 'in any tech industry'
      : `in the ${industry} industry`;

    return `As an expert project strategist, identify ${appConfig.UI_SETTINGS.trendingTopicsCount} trending, in-demand capstone project topics ${industryPrompt}. These topics should be specific and represent real-world applications, including suggestions based on popular and emerging frameworks, GitHub libraries, HuggingFace models, or programming concepts. Each topic must be concise, with a maximum of 5 words. Good examples include: "AI-Powered Code Assistant", "Real-Time Fraud Detection using Kafka", "Micro-Frontends with Module Federation", "Building a RAG App with LangChain".`;
};
