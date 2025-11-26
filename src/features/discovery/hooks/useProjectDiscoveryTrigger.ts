import { useEffect } from 'react';
import { useCurriculumStore } from '../../../store';
import type { DiscoveryType } from '../../../types';
import type { ViewState } from './useDiscoveryState';

interface UseProjectDiscoveryTriggerProps {
    handleStartDiscovery: (files: File[], options?: { forceDiscoveryType?: DiscoveryType }) => Promise<void>;
    clearCache: () => void;
    clearResults: () => void;
    setView: (view: ViewState) => void;
    setDiscoveryType: (type: DiscoveryType) => void;
    setSearchValue: (value: string) => void;
}

export const useProjectDiscoveryTrigger = ({
    handleStartDiscovery,
    clearCache,
    clearResults,
    setView,
    setDiscoveryType,
    setSearchValue,
}: UseProjectDiscoveryTriggerProps) => {
    const {
        curriculumForProjectDiscovery,
        setCurriculumForProjectDiscovery,
        startProjectDiscovery,
        setStartProjectDiscovery,
    } = useCurriculumStore();

    useEffect(() => {
        if (startProjectDiscovery && curriculumForProjectDiscovery) {
            setStartProjectDiscovery(false); // Reset the trigger

            // Clean up state for the new discovery
            clearCache();
            clearResults();
            setView('idle');
            setDiscoveryType('project');
            
            // Set up search value from the curriculum title
            const courseTitleMatch = curriculumForProjectDiscovery.match(/^# Course Curriculum: (.*)\n/);
            const courseTitle = courseTitleMatch ? courseTitleMatch[1] : 'Related Capstone Projects';
            setSearchValue(courseTitle);
            
            // Convert the curriculum string into a File object to pass to the discovery function
            const curriculumBlob = new Blob([curriculumForProjectDiscovery], { type: 'text/plain' });
            const curriculumFile = new File([curriculumBlob], 'curriculum.md', { type: 'text/plain' });

            // Use a timeout to ensure state updates have propagated before starting discovery
            setTimeout(() => {
                handleStartDiscovery([curriculumFile], { forceDiscoveryType: 'project' });
            }, 100);

            // Clean up the context value
            setCurriculumForProjectDiscovery(null);
        }
    }, [
        startProjectDiscovery, 
        curriculumForProjectDiscovery, 
        handleStartDiscovery, 
        setStartProjectDiscovery, 
        setCurriculumForProjectDiscovery, 
        clearCache, 
        clearResults,
        setView,
        setDiscoveryType,
        setSearchValue
    ]);
};
