
import type { LessonPlan, Exercise } from '../types';

const parseExercisesMarkdown = (markdown: string): Exercise[] => {
    if (!markdown.trim()) return [];
    const exercises: Exercise[] = [];
    const exerciseBlocks = markdown.split('---').map(s => s.trim()).filter(Boolean);

    for (const block of exerciseBlocks) {
        const problemMatch = block.match(/\*\*Problem:\*\*\n([\s\S]*?)(\n\n\*\*Hint:\*\*|$)/);
        const hintMatch = block.match(/\*\*Hint:\*\*\n\*?([\s\S]*?)\*?\n\n\*\*Answer:\*\*/);
        const answerMatch = block.match(/\*\*Answer:\*\*\n`{3}([\s\S]*?)`{3}\n\n\*\*Explanation:\*\*/);
        const explanationMatch = block.match(/\*\*Explanation:\*\*\n([\s\S]*)/);

        if (problemMatch && hintMatch && answerMatch && explanationMatch) {
            exercises.push({
                problem: problemMatch[1].trim(),
                hint: hintMatch[1].trim(),
                answer: answerMatch[1].trim(),
                explanation: explanationMatch[1].trim(),
            });
        }
    }
    return exercises;
};

const parseQuizMarkdown = (markdown: string): LessonPlan['quiz'] => {
    const quiz: LessonPlan['quiz'] = { questions: [] };
    if (!markdown.trim()) return quiz;
    
    const questionBlocks = markdown.split('---').map(s => s.trim()).filter(Boolean);

    for (const block of questionBlocks) {
        const questionMatch = block.match(/\*\*Question \d+: ([\s\S]*?)\*\*\n\n/);
        const optionsMatch = block.match(/- \[[x ]\] ([\s\S]*?)\n/g);
        const explanationMatch = block.match(/\*\*Explanation:\*\* ([\s\S]*)/);

        if (questionMatch && optionsMatch && explanationMatch) {
            const question = questionMatch[1].trim();
            const options = optionsMatch.map(opt => opt.replace(/- \[[x ]\] /, '').trim());
            const answer = optionsMatch.find(opt => opt.includes('[x]'))?.replace(/- \[x\] /, '').trim() || '';
            const explanation = explanationMatch[1].trim();

            quiz.questions.push({ question, options, answer, explanation });
        }
    }
    return quiz;
};

const parseList = (markdown: string): string[] => {
    if (!markdown) return [];
    return markdown.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^- /, '').trim());
};

/**
 * Parses a markdown string of a lesson plan into its constituent sections.
 */
export const parseLessonPlanMarkdown = (markdown: string): Partial<LessonPlan> => {
    const parsedData: Partial<LessonPlan> = {
        overview: '',
        learningObjectives: [],
        activation: '',
        demonstration: '',
        application: '',
        integration: '',
        reflectionAndAssessment: '',
        exercises: [],
        quiz: { questions: [] },
        // Legacy support mapping
        lessonOutcome: '',
        lessonOutline: '',
    };
    if (!markdown) return parsedData;

    // Split by level 2 headings: matches start of line, ##, optional space, then captures the title
    const sectionRegex = /^##\s+(.+)$/gm;
    let match;
    let lastIndex = 0;
    let currentHeader = '';

    const sections: { header: string, content: string }[] = [];

    // Find all headers
    while ((match = sectionRegex.exec(markdown)) !== null) {
        if (currentHeader) {
            sections.push({
                header: currentHeader,
                content: markdown.substring(lastIndex, match.index).trim()
            });
        }
        currentHeader = match[1].trim();
        lastIndex = match.index + match[0].length;
    }
    // Push the last section
    if (currentHeader) {
        sections.push({
            header: currentHeader,
            content: markdown.substring(lastIndex).trim()
        });
    }

    // Fallback: If no ## headers found, try to treat everything as legacy outline/demonstration
    if (sections.length === 0 && markdown.trim().length > 0) {
         parsedData.lessonOutline = markdown;
         parsedData.demonstration = markdown;
         return parsedData;
    }

    for (const { header: rawHeader, content } of sections) {
        // Remove numbering "1. ", "3.1 " etc from the header check
        const header = rawHeader.toLowerCase().replace(/^\d+(\.\d+)?\s*/, '');

        if (header.includes('overview') || header.includes('lesson overview') || header.includes('lesson outcome')) {
            parsedData.overview = content;
            parsedData.lessonOutcome = content; // Legacy sync
        } else if (header.includes('learning objectives') || header.includes('objectives')) {
            parsedData.learningObjectives = parseList(content);
        } else if (header.includes('activation')) {
            parsedData.activation = content;
        } else if (header.includes('demonstration')) {
            parsedData.demonstration = content;
            parsedData.lessonOutline = content; // Legacy sync
        } else if (header.includes('application')) {
            parsedData.application = content;
        } else if (header.includes('integration')) {
            parsedData.integration = content;
        } else if (header.includes('feedback') || header.includes('reflection')) {
            parsedData.reflectionAndAssessment = content;
        } else if (header.includes('exercises')) {
            parsedData.exercises = parseExercisesMarkdown(content);
        } else if (header.includes('quiz')) {
            parsedData.quiz = parseQuizMarkdown(content);
        } else if (header.includes('lesson sequence')) {
            // Backward compatibility for nested Level 3 headers
            const subParts = content.split(/^###\s+/gm);
            for (const sub of subParts) {
                 const subLines = sub.split('\n');
                 const subHeaderRaw = subLines[0].trim().toLowerCase().replace(/^\d+(\.\d+)?\s*/, '');
                 const subContent = subLines.slice(1).join('\n').trim();
                 if(!subHeaderRaw) continue;

                 if (subHeaderRaw.includes('activation')) parsedData.activation = subContent;
                 else if (subHeaderRaw.includes('demonstration')) { parsedData.demonstration = subContent; parsedData.lessonOutline = subContent; }
                 else if (subHeaderRaw.includes('application')) parsedData.application = subContent;
                 else if (subHeaderRaw.includes('integration')) parsedData.integration = subContent;
                 else if (subHeaderRaw.includes('feedback') || subHeaderRaw.includes('reflection')) parsedData.reflectionAndAssessment = subContent;
            }
        } else if (header.includes('lesson outline')) {
            // Legacy fallback
            parsedData.lessonOutline = content;
            if (!parsedData.demonstration) parsedData.demonstration = content;
        }
    }

    return parsedData;
};

export const stripMarkdown = (markdown: string): string => {
    if (!markdown) return '';
    let text = markdown;
    
    // Remove code block fences
    text = text.replace(/```[\w]*\n?/g, ''); 
    
    // Remove images ![alt](url) -> alt
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');

    // Remove links [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Remove bold/italic (** or __)
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    
    // Remove italic (* or _)
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');

    // Remove inline code
    text = text.replace(/`([^`]+)`/g, '$1');

    // Remove headers
    text = text.replace(/^#+\s+/gm, '');

    // Remove blockquotes
    text = text.replace(/^>\s+/gm, '');

    // Remove list markers at start of string (e.g. *, -, +, 1.)
    text = text.replace(/^[\s\t]*([\*\-\+]|\d+\.)\s+/gm, '');
    
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');

    return text.trim();
};
