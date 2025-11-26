import { useLocalStorage } from '../../../hooks';
import type { GenerateCurriculumResponse } from '../../../types';
import type { GenerateCapstoneProjectsResponse } from '../../../api/generateCapstoneProjects';
import { appConfig } from '../../../config';

export const useDiscoveryCache = () => {
    const [cachedCurriculumResults, setCachedCurriculumResults] = useLocalStorage<GenerateCurriculumResponse | null>(appConfig.STORAGE_KEYS.discoveryCurriculumCache, null);
    const [cachedProjectResults, setCachedProjectResults] = useLocalStorage<GenerateCapstoneProjectsResponse | null>(appConfig.STORAGE_KEYS.discoveryProjectCache, null);

    const saveCurriculumToCache = (data: GenerateCurriculumResponse) => {
        setCachedCurriculumResults(data);
        setCachedProjectResults(null); // Invalidate other cache
    };

    const saveProjectsToCache = (data: GenerateCapstoneProjectsResponse) => {
        setCachedProjectResults(data);
        setCachedCurriculumResults(null); // Invalidate other cache
    };

    const clearCache = () => {
        setCachedCurriculumResults(null);
        setCachedProjectResults(null);
    };

    return {
        cachedCurriculumResults,
        cachedProjectResults,
        saveCurriculumToCache,
        saveProjectsToCache,
        clearCache
    };
};