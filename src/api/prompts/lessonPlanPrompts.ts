import type { Curriculum, LessonPlan, GenerationOptions } from '../../types';

const getPreviousLessonsContext = (curriculum: Curriculum, previousLessons: LessonPlan[]): string => {
    if (!previousLessons || previousLessons.length === 0) {
        return '';
    }

    const previousLessonsJSON = JSON.stringify(
        previousLessons.map((plan, index) => ({
            lessonTitle: curriculum.content.lessons[index],
            lessonPlan: {
                lessonOutcome: plan.lessonOutcome,
                lessonOutline: plan.lessonOutline,
            }
        })), 
    null, 2);

    return `
**CONTEXT from Previous Lessons (in JSON format):**
You have already generated the following lesson plans for this curriculum. Use this information to ensure the new lesson plan builds upon them logically, avoids repetition, and maintains a consistent flow of difficulty and concepts.
\`\`\`json
${previousLessonsJSON}
\`\`\`
`;
}

export const getLessonPlanPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    previousLessons: LessonPlan[],
): string => {
    const previousLessonsContext = getPreviousLessonsContext(curriculum, previousLessons);

    const instructions = `Your output MUST be a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting (like \`\`\`json) or explanatory text outside of the JSON object. Ensure that any special characters are properly escaped for JSON (e.g., double quotes as \\" and backslashes as \\\\).
The JSON object must contain these keys: "lessonOutcome", "lessonOutline", "exercises", "quiz", and "project".
- "lessonOutcome": A concise learning outcome.
- "lessonOutline": A markdown-formatted lesson plan.
- "exercises": A JSON array of exactly ${options.exercisesPerLesson} exercise object(s).
- "quiz.questions": A JSON array of exactly ${options.quizQuestionsPerLesson} question object(s).
- "project": An object with an empty "description", "objective", and "deliverables" array \`[]\`.`;
    
    return `You are an expert instructional designer. Generate a detailed lesson plan for the lesson titled "${lesson}" from the curriculum "${curriculum.title}".
${previousLessonsContext}
Audience difficulty: "${curriculum.tags.find(t => ['Beginner', 'Intermediate', 'Advanced'].includes(t)) || 'Beginner'}".
Style: "${options.style}".
Duration: ~${options.lessonDuration} hour(s).
Additional instructions: "${options.instructions}".
CRITICAL: The "lessonOutline" field must NOT include the lesson title ("${lesson}"). Start directly with the content.
CRITICAL: Any programming code must be in markdown code blocks with a language identifier (e.g., \`\`\`python).
CRITICAL: For quiz questions, options/answers with HTML or code must be in backticks (e.g., "\`<p>\`").

${instructions}
`;
};
