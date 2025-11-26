import { useState, useEffect } from 'react';
import { discoveryService } from '../../../services';

type DiscoveryType = 'course' | 'project';

export const useTrendingTopics = (discoveryType: DiscoveryType, industry: string, enabled: boolean) => {
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [isFetchingTopics, setIsFetchingTopics] = useState(true);

    useEffect(() => {
        if (enabled) {
            const loadTrendingTopics = async () => {
                setIsFetchingTopics(true);
                setTrendingTopics([]);
                const topics = await (discoveryType === 'course' ? discoveryService.fetchTrendingTopics(industry) : discoveryService.fetchTrendingCapstoneTopics(industry));
                setTrendingTopics(topics);
                setIsFetchingTopics(false);
            };
            loadTrendingTopics();
        }
    }, [enabled, industry, discoveryType]);

    return { trendingTopics, isFetchingTopics };
}