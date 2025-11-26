import { useState, useEffect, useCallback } from 'react';
import { discoveryService } from '../../../services';
import { industries, appConfig } from '../../../config';
import type { IndustryTrend } from '../../../types';
import { useCurriculumStore, useNavigationStore } from '../../../store';

const defaultIndustry = industries.find(i => i.default) || industries[0];

export const useTrending = () => {
    const [selectedIndustry, setSelectedIndustry] = useState(defaultIndustry.value);
    const [timePeriod, setTimePeriod] = useState(appConfig.UI_SETTINGS.trendingFeature.defaultTimePeriod);
    const [trends, setTrends] = useState<IndustryTrend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [activeTrend, setActiveTrendState] = useState<IndustryTrend | null>(null);

    const { setStartGenerationWithPrompt } = useCurriculumStore();
    const navigateTo = useNavigationStore(state => state.navigateTo);

    const setActiveTrend = useCallback(async (trend: IndustryTrend) => {
        setActiveTrendState(trend);
        if (trend.sources === undefined) {
            setIsDetailLoading(true);
            try {
                const details = await discoveryService.fetchTopicDetails(trend.topic, timePeriod);
                const updatedTrend = { ...trend, ...details };

                setTrends(prevTrends => {
                    const newTrends = prevTrends.map(t => t.topic === trend.topic ? updatedTrend : t);
                    setActiveTrendState(updatedTrend);
                    return newTrends;
                });
            } catch (error) {
                console.error(`Failed to fetch details for ${trend.topic}`, error);
            } finally {
                setIsDetailLoading(false);
            }
        }
    }, [timePeriod]);
    
    useEffect(() => {
        const initialFetch = async () => {
            setIsLoading(true);
            setHasMore(true);
            setActiveTrendState(null);
            setTrends([]);
            try {
                const trendData = await discoveryService.fetchIndustryTrends(selectedIndustry, appConfig.UI_SETTINGS.trendingFeature.topicsPerPage, [], timePeriod);
                if (trendData.length < appConfig.UI_SETTINGS.trendingFeature.topicsPerPage) {
                    setHasMore(false);
                }
                setTrends(trendData);
                if (trendData.length > 0) {
                    setActiveTrend(trendData[0]);
                }
            } catch (error) {
                console.error("Failed to fetch trends", error);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };
        initialFetch();
    }, [selectedIndustry, timePeriod, setActiveTrend]);

    const loadMoreTrends = async () => {
        if (!isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            try {
                const existingTopics = trends.map(t => t.topic);
                const trendData = await discoveryService.fetchIndustryTrends(selectedIndustry, appConfig.UI_SETTINGS.trendingFeature.topicsPerPage, existingTopics, timePeriod);
                if (trendData.length < appConfig.UI_SETTINGS.trendingFeature.topicsPerPage) {
                    setHasMore(false);
                }
                setTrends(prev => [...prev, ...trendData]);
            } catch (error) {
                console.error("Failed to fetch more trends", error);
                setHasMore(false);
            } finally {
                setIsLoadingMore(false);
            }
        }
    };

    const handleTimePeriodChange = (newPeriod: string) => {
        setTimePeriod(newPeriod);
    };

    const handleGenerate = (topic: string, type: 'course' | 'project') => {
        setTimeout(() => {
            setStartGenerationWithPrompt({ prompt: topic, type });
            navigateTo('Generation');
        }, 300);
    };

    return {
        selectedIndustry,
        setSelectedIndustry,
        trends,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMoreTrends,
        activeTrend,
        setActiveTrend,
        isDetailLoading,
        handleGenerate,
        timePeriod,
        handleTimePeriodChange,
        timePeriods: appConfig.UI_SETTINGS.trendingFeature.timePeriods,
    };
};