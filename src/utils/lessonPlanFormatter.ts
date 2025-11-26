import type { LessonPlan } from '../types';

export function lessonPlanToMarkdown(lessonPlan: LessonPlan): string {
    let markdown = ``;

    if (lessonPlan.lessonOutcome) {
        markdown += `### Lesson Outcome\n\n${lessonPlan.lessonOutcome}\n\n`;
    }

    if (lessonPlan.lessonOutline) {
        markdown += `### Lesson Outline\n\n${lessonPlan.lessonOutline}\n\n`;
    }

    if (lessonPlan.exercises && lessonPlan.exercises.length > 0) {
        markdown += `### Exercises\n\n---\n\n`;
        lessonPlan.exercises.forEach((ex, i) => {
            markdown += `**Exercise ${i + 1}**\n\n**Problem:**\n${ex.problem}\n\n`;
            markdown += `**Hint:**\n*${ex.hint}*\n\n`;
            markdown += `**Answer:**\n\`\`\`\n${ex.answer}\n\`\`\`\n\n`;
            markdown += `**Explanation:**\n${ex.explanation}\n\n---\n\n`;
        });
    }

    if (lessonPlan.quiz && lessonPlan.quiz.questions.length > 0) {
        markdown += `### Quiz\n\n---\n\n`;
        lessonPlan.quiz.questions.forEach((q, i) => {
            markdown += `**Question ${i + 1}: ${q.question}**\n\n`;
            q.options.forEach(opt => {
                markdown += `- [${opt === q.answer ? 'x' : ' '}] ${opt}\n`;
            });
            markdown += `\n**Explanation:** ${q.explanation}\n\n---\n\n`;
        });
    }

    if (lessonPlan.project) {
        markdown += `### Project\n\n`;
        markdown += `**Description:**\n${lessonPlan.project.description}\n\n`;
        markdown += `**Objective:**\n${lessonPlan.project.objective}\n\n`;
        markdown += `**Deliverables:**\n`;
        lessonPlan.project.deliverables.forEach(d => {
            markdown += `- ${d}\n`;
        });
        markdown += `\n`;
    }

    return markdown;
}