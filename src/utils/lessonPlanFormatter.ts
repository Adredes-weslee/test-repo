
import type { LessonPlan } from '../types';

export function lessonPlanToMarkdown(lessonPlan: LessonPlan): string {
    let markdown = ``;

    // 1. Overview
    if (lessonPlan.overview || lessonPlan.lessonOutcome) {
        markdown += `## 1. Overview\n\n${lessonPlan.overview || lessonPlan.lessonOutcome}\n\n`;
    }

    // 2. Learning Objectives
    if (lessonPlan.learningObjectives && lessonPlan.learningObjectives.length > 0) {
        markdown += `## 2. Learning Objectives\n\n`;
        lessonPlan.learningObjectives.forEach(lo => {
            markdown += `- ${lo}\n`;
        });
        markdown += `\n`;
    }

    // 3. Activation (Merrill)
    if (lessonPlan.activation) {
        markdown += `## 3. Activation\n\n${lessonPlan.activation}\n\n`;
    }

    // 4. Demonstration (Merrill)
    if (lessonPlan.demonstration || lessonPlan.lessonOutline) {
        markdown += `## 4. Demonstration\n\n${lessonPlan.demonstration || lessonPlan.lessonOutline}\n\n`;
    }

    // 5. Application (Merrill)
    if (lessonPlan.application) {
        markdown += `## 5. Application\n\n${lessonPlan.application}\n\n`;
    }

    // 6. Integration (Merrill)
    if (lessonPlan.integration) {
        markdown += `## 6. Integration\n\n${lessonPlan.integration}\n\n`;
    }

    // 7. Feedback & Reflection
    if (lessonPlan.reflectionAndAssessment) {
        markdown += `## 7. Feedback & Reflection\n\n${lessonPlan.reflectionAndAssessment}\n\n`;
    }

    // 8. Exercises
    if (lessonPlan.exercises && lessonPlan.exercises.length > 0) {
        markdown += `## 8. Exercises\n\n---\n\n`;
        lessonPlan.exercises.forEach((ex, i) => {
            markdown += `**Exercise ${i + 1}**\n\n**Problem:**\n${ex.problem}\n\n`;
            markdown += `**Hint:**\n*${ex.hint}*\n\n`;
            markdown += `**Answer:**\n\`\`\`\n${ex.answer}\n\`\`\`\n\n`;
            markdown += `**Explanation:**\n${ex.explanation}\n\n---\n\n`;
        });
    }

    // 9. Quiz
    if (lessonPlan.quiz && lessonPlan.quiz.questions && lessonPlan.quiz.questions.length > 0) {
        markdown += `## 9. Quiz\n\n---\n\n`;
        lessonPlan.quiz.questions.forEach((q, i) => {
            markdown += `**Question ${i + 1}: ${q.question}**\n\n`;
            q.options.forEach(opt => {
                markdown += `- [${opt === q.answer ? 'x' : ' '}] ${opt}\n`;
            });
            markdown += `\n**Explanation:** ${q.explanation}\n\n---\n\n`;
        });
    }

    if (lessonPlan.project && lessonPlan.project.description) {
        markdown += `## Project (Legacy)\n\n`;
        markdown += `**Description:**\n${lessonPlan.project.description}\n\n`;
        markdown += `**Objective:**\n${lessonPlan.project.objective}\n\n`;
    }

    return markdown;
}
