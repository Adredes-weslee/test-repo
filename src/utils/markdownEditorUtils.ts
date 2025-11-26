import type { Exercise } from '../types';
import type { LessonPlan } from '../types';

type QuizQuestion = LessonPlan['quiz']['questions'][0];

export const exerciseToMarkdown = (exercise: Exercise): string => {
    return `**Problem:**\n${exercise.problem}\n\n**Hint:**\n*${exercise.hint}*\n\n**Answer:**\n\`\`\`\n${exercise.answer}\n\`\`\`\n\n**Explanation:**\n${exercise.explanation}`;
};

export const parseExerciseMarkdown = (markdown: string): Exercise => {
    const problem = markdown.match(/\*\*Problem:\*\*\n([\s\S]*?)(\n\n\*\*Hint:\*\*|$)/)?.[1]?.trim() || '';
    const hint = markdown.match(/\*\*Hint:\*\*\n\*([\s\S]*?)\*\n\n\*\*Answer:\*\*/)?.[1]?.trim() || '';
    const answer = markdown.match(/\*\*Answer:\*\*\n`{3}([\s\S]*?)`{3}\n\n\*\*Explanation:\*\*/)?.[1]?.trim() || '';
    const explanation = markdown.match(/\*\*Explanation:\*\*\n([\s\S]*)/)?.[1]?.trim() || '';

    return { problem, hint, answer, explanation };
};

export const quizQuestionToMarkdown = (q: QuizQuestion): string => {
    return `**Question:**\n${q.question}\n\n**Options:**\n${q.options.join('\n')}\n\n**Answer:**\n${q.answer}\n\n**Explanation:**\n${q.explanation}`;
};

export const parseQuizQuestionMarkdown = (markdown: string): QuizQuestion => {
    const question = markdown.match(/\*\*Question:\*\*\n([\s\S]*?)(\n\n\*\*Options:\*\*|$)/)?.[1]?.trim() || '';
    const optionsStr = markdown.match(/\*\*Options:\*\*\n([\s\S]*?)(\n\n\*\*Answer:\*\*|$)/)?.[1]?.trim() || '';
    const options = optionsStr.split('\n').map(o => o.trim()).filter(Boolean);
    const answer = markdown.match(/\*\*Answer:\*\*\n([\s\S]*?)(\n\n\*\*Explanation:\*\*|$)/)?.[1]?.trim() || '';
    const explanation = markdown.match(/\*\*Explanation:\*\*\n([\s\S]*)/)?.[1]?.trim() || '';

    return { question, options, answer, explanation };
};
