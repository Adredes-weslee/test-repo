
export type RegenerationPart = 
    | { type: 'outcome' }
    | { type: 'outline' }
    | { type: 'project' }
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