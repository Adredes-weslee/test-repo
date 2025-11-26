import type { Curriculum } from '../../types';

export const getVariedCurriculumPrompt = (
    originalCurriculum: Curriculum,
    originalLessonTitle: string,
    instructions: string,
): string => {
    return `You are an expert curriculum designer. You are given an existing course curriculum and an instruction to vary one of its lessons. Your task is to regenerate the ENTIRE curriculum outline to reflect this change.

**Original Curriculum:**
- Title: "${originalCurriculum.title}"
- Lessons: ${originalCurriculum.content.lessons.join(', ')}
- Description: "${originalCurriculum.description}"
- Difficulty: "${originalCurriculum.tags.find(t => ['Beginner', 'Intermediate', 'Advanced'].includes(t)) || 'Beginner'}"

**Variation Request:**
- Vary this lesson: "${originalLessonTitle}"
- Instructions: "${instructions}"

**Your Task:**
Create a new, cohesive curriculum outline.
1. Generate a new title for the course that reflects the variation.
2. Generate a new list of lesson titles. The number of lessons can change. The topics should be adjusted based on the variation, ensuring a logical flow.
3. Generate a new description and tags (including difficulty).

Your output MUST be a single JSON object that strictly adheres to the provided schema.`;
};
