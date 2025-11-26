
import { useState } from 'react';
import type { Curriculum, CapstoneProject } from '../../../types';

export const useDiscoveryResults = () => {
    const [curriculumResults, setCurriculumResults] = useState<Curriculum[]>([]);
    const [projectResults, setProjectResults] = useState<CapstoneProject[]>([]);
    const [agentThoughts, setAgentThoughts] = useState<string[]>([]);

    const clearResults = () => {
        setCurriculumResults([]);
        setProjectResults([]);
        setAgentThoughts([]);
    };

    return {
        curriculumResults,
        setCurriculumResults,
        projectResults,
        setProjectResults,
        agentThoughts,
        setAgentThoughts,
        clearResults,
    };
};
