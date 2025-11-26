import { useEffect } from 'react';
import { useCurriculumStore } from '../../../store';
import type { DiscoveryType, CapstoneProject } from '../../../types';
import type { ViewState } from './useDiscoveryState';

interface UseCourseDiscoveryTriggerProps {
    handleStartDiscovery: (files: File[], options?: { forceDiscoveryType?: DiscoveryType }) => Promise<void>;
    clearCache: () => void;
    clearResults: () => void;
    setView: (view: ViewState) => void;
    setDiscoveryType: (type: DiscoveryType) => void;
    setSearchValue: (value: string) => void;
}

const projectToMarkdown = (project: CapstoneProject): string => {
    let md = `# Project Specification: ${project.title}\n\n`;
    md += `This document outlines a capstone project. Based on its content, please generate relevant course curriculum ideas that would prepare a student to build this project.\n\n---\n\n`;
    md += `## Description\n${project.detailedDescription}\n\n`;
    md += `## Tech Stack\n${project.techStack.map(t => `- ${t}`).join('\n')}\n\n`;
    md += `## Learning Outcomes\n${project.learningOutcomes.map(o => `- ${o}`).join('\n')}\n\n`;
    md += `## Requirements\n${project.projectRequirements.map(r => `- ${r}`).join('\n')}\n\n`;
    md += `## Deliverables\n${project.deliverables.map(d => `- ${d}`).join('\n')}\n\n`;
    return md;
}

export const useCourseDiscoveryTrigger = ({
    handleStartDiscovery,
    clearCache,
    clearResults,
    setView,
    setDiscoveryType,
    setSearchValue,
}: UseCourseDiscoveryTriggerProps) => {
    const {
        projectForCourseDiscovery,
        setProjectForCourseDiscovery,
        startCourseDiscovery,
        setStartCourseDiscovery,
    } = useCurriculumStore();

    useEffect(() => {
        if (startCourseDiscovery && projectForCourseDiscovery) {
            setStartCourseDiscovery(false); // Reset trigger

            clearCache();
            clearResults();
            setView('idle');
            setDiscoveryType('course');
            
            setSearchValue(`Courses for "${projectForCourseDiscovery.title}"`);
            
            const projectMarkdown = projectToMarkdown(projectForCourseDiscovery);
            const projectBlob = new Blob([projectMarkdown], { type: 'text/plain' });
            const projectFile = new File([projectBlob], 'project-spec.md', { type: 'text/plain' });

            setTimeout(() => {
                handleStartDiscovery([projectFile], { forceDiscoveryType: 'course' });
            }, 100);

            setProjectForCourseDiscovery(null);
        }
    }, [
        startCourseDiscovery, 
        projectForCourseDiscovery, 
        handleStartDiscovery, 
        setStartCourseDiscovery, 
        setProjectForCourseDiscovery, 
        clearCache, 
        clearResults,
        setView,
        setDiscoveryType,
        setSearchValue
    ]);
};
