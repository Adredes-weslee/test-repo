import type { LessonPlan, Exercise } from '../types';

const parseExercisesMarkdown = (markdown: string): Exercise[] => {
    if (!markdown.trim()) return [];
    const exercises: Exercise[] = [];
    const exerciseBlocks = markdown.split('---').map(s => s.trim()).filter(Boolean);

    for (const block of exerciseBlocks) {
        const problemMatch = block.match(/\*\*Problem:\*\*\n([\s\S]*?)\n\n\*\*Hint:\*\*/);
        const hintMatch = block.match(/\*\*Hint:\*\*\n\*([\s\S]*?)\*\n\n\*\*Answer:\*\*/);
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


const parseProjectMarkdown = (markdown: string): LessonPlan['project'] => {
    const project: LessonPlan['project'] = { description: '', objective: '', deliverables: [] };
    if (!markdown.trim()) return project;
    
    const descriptionMatch = markdown.match(/\*\*Description:\*\*\n([\s\S]*?)\n\n\*\*Objective:\*\*/);
    const objectiveMatch = markdown.match(/\*\*Objective:\*\*\n([\s\S]*?)\n\n\*\*Deliverables:\*\*/);
    const deliverablesMatch = markdown.match(/\*\*Deliverables:\*\*\n([\s\S]*)/);
    
    if (descriptionMatch) project.description = descriptionMatch[1].trim();
    if (objectiveMatch) project.objective = objectiveMatch[1].trim();
    if (deliverablesMatch) {
        project.deliverables = deliverablesMatch[1].split('\n').map(d => d.replace(/^- /, '').trim()).filter(Boolean);
    }
    
    return project;
};


/**
 * Parses a markdown string of a lesson plan into its constituent sections.
 * @param markdown - The full markdown string for a lesson plan.
 * @returns An object containing the structured data for each section.
 */
export const parseLessonPlanMarkdown = (markdown: string): Partial<LessonPlan> => {
    const parsedData: Partial<LessonPlan> = {
        lessonOutcome: '',
        lessonOutline: '',
        exercises: [],
        quiz: { questions: [] },
        project: { description: '', objective: '', deliverables: [] },
    };
    if (!markdown) return parsedData;

    // Use a regex to find all sections. Add newlines to assist with matching the last section.
    const sectionRegex = /### (Lesson Outcome|Lesson Outline|Exercises|Quiz|Project)\s*\n\n([\s\S]*?)(?=\n\n###|$)/g;
    let match;
    const effectiveMarkdown = markdown + '\n\n';
    let sectionsFound = false;

    while ((match = sectionRegex.exec(effectiveMarkdown)) !== null) {
        sectionsFound = true;
        const [, sectionName, content] = match;
        const trimmedContent = content.trim();

        switch (sectionName) {
            case 'Lesson Outcome':
                parsedData.lessonOutcome = trimmedContent;
                break;
            case 'Lesson Outline':
                parsedData.lessonOutline = trimmedContent;
                break;
            case 'Exercises':
                parsedData.exercises = parseExercisesMarkdown(trimmedContent);
                break;
            case 'Quiz':
                parsedData.quiz = parseQuizMarkdown(trimmedContent);
                break;
            case 'Project':
                parsedData.project = parseProjectMarkdown(trimmedContent);
                break;
        }
    }
    
    // If no sections were parsed via regex, assume the whole content is the lesson outline.
    if (!sectionsFound && !markdown.trim().startsWith('###')) {
         parsedData.lessonOutline = markdown.trim();
    }

    return parsedData;
};