import { fetchTrendingTopics, fetchTrendingCapstoneTopics, generateCurriculum, generateCapstoneProjects, fetchIndustryTrends, fetchTrendData, fetchTopicDetails } from '../api';
import type { GenerateCurriculumResponse, IndustryTrend } from '../types';
import type { GenerateCapstoneProjectsResponse } from '../api/generateCapstoneProjects';
import { getOrchestrationStatus, isOrchestratorEnabled, startOrchestration } from '../api/orchestrator';
import { appConfig } from '../config';
import { simulateProgress } from '../utils';
import type { OrchestrationRun } from '../api/orchestrator';

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
    if (!isOrchestratorEnabled) {
      return generateCurriculum(topic, filters, files, onProgress);
    }

    const progressInterval = simulateProgress(appConfig.SIMULATED_PROGRESS_DURATIONS.discovery, onProgress);

    const pollInterval = 400;
    const isTerminalStatus = (status?: string) => ['completed', 'failed', 'cancelled'].includes(status || '');

    const awaitNextStatus = () => new Promise(resolve => setTimeout(resolve, pollInterval));

    const mapRunToCurriculum = (run: OrchestrationRun): GenerateCurriculumResponse => {
      const generationOutput = (run.output as any)?.generation ?? run.output ?? {};

      return {
        curriculums: generationOutput.curriculums ?? [],
        agentThoughts: generationOutput.agentThoughts ?? generationOutput.thoughts ?? [],
      };
    };

    return (async () => {
      try {
        const { id, runId } = await startOrchestration({ type: 'course', topic, filters, files });
        const orchestrationId = id || runId;

        if (!orchestrationId) {
          throw new Error('Failed to start curriculum orchestration');
        }

        const startTime = Date.now();
        const maxWaitTime = 60_000;
        let run = await getOrchestrationStatus(orchestrationId);

        while (!isTerminalStatus(run.status)) {
          if (Date.now() - startTime > maxWaitTime) {
            throw new Error('Curriculum orchestration timed out after 60 seconds');
          }
          await awaitNextStatus();
          run = await getOrchestrationStatus(orchestrationId);
        }

        clearInterval(progressInterval);

        if (run.status === 'completed') {
          onProgress(100);
          return mapRunToCurriculum(run);
        }

        onProgress(0);
        throw new Error(run.error?.message ?? 'Curriculum orchestration failed');
      } catch (error) {
        clearInterval(progressInterval);
        onProgress(0);
        throw error;
      }
    })();
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
