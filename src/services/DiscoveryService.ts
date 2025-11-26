import { fetchTrendingTopics, fetchTrendingCapstoneTopics, generateCurriculum, generateCapstoneProjects, fetchIndustryTrends, fetchTrendData, fetchTopicDetails } from '../api';
import type { GenerateCurriculumResponse, IndustryTrend } from '../types';
import type { GenerateCapstoneProjectsResponse } from '../api/generateCapstoneProjects';

interface FileData { mimeType: string; data: string; }
type FilterOptions = { [key: string]: string; };

class DiscoveryService {
  fetchTrendingTopics(industry: string): Promise<string[]> {
    return fetchTrendingTopics(industry);
  }

  fetchTrendingCapstoneTopics(industry: string): Promise<string[]> {
    return fetchTrendingCapstoneTopics(industry);
  }

  fetchIndustryTrends(industry: string, count: number, existingTopics: string[], timePeriod: string): Promise<IndustryTrend[]> {
    return fetchIndustryTrends(industry, count, existingTopics, timePeriod);
  }

  fetchTrendData(topic: string, timePeriod: string): Promise<number[]> {
    return fetchTrendData(topic, timePeriod);
  }
  
  fetchTopicDetails(topic: string, timePeriod: string): Promise<Pick<IndustryTrend, 'detailedDescription' | 'sources'>> {
    return fetchTopicDetails(topic, timePeriod);
  }

  generateCurriculum(
    topic: string,
    filters: FilterOptions,
    files: FileData[],
    onProgress: (progress: number) => void
  ): Promise<GenerateCurriculumResponse> {
    return generateCurriculum(topic, filters, files, onProgress);
  }

  generateCapstoneProjects(
    topic: string,
    industry: string,
    files: FileData[],
    onProgress: (progress: number) => void
  ): Promise<GenerateCapstoneProjectsResponse> {
    return generateCapstoneProjects(topic, industry, files, onProgress);
  }
}

export const discoveryService = new DiscoveryService();