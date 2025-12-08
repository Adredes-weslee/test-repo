
export type RegenerationPart = 
    | { type: 'outcome' } // Legacy mapping to overview
    | { type: 'outline' } // Legacy mapping to demonstration
    | { type: 'project' } // Legacy
    | { type: 'overview' }
    | { type: 'objectives' }
    | { type: 'activation' }
    | { type: 'demonstration' }
    | { type: 'application' }
    | { type: 'integration' }
    | { type: 'reflectionAndAssessment' }
    | { type: 'title' }
    | { type: 'curriculumTitle' }
    | { type: 'exercise', index: number }
    | { type: 'quiz', index: number };

export const getRegenerationPartId = (part: RegenerationPart): string => {
    if ('index' in part) {
        return `${part.type}-${part.index}`;
    }
    return part.type;
};
