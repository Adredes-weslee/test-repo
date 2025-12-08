
import type { Curriculum, LessonPlan, GenerationOptions } from '../../types';

const getBaseContext = (curriculum: Curriculum, options: GenerationOptions) => `
**Target Audience & Style:**
- Difficulty Level: "${curriculum.tags.find(t => ['Beginner', 'Intermediate', 'Advanced'].includes(t)) || 'Beginner'}"
- Style: "${options.style}"
- Duration: ~${options.lessonDuration} hour(s)
- Additional User Instructions: "${options.instructions}"
`;

const getJsonRules = () => `
**CRITICAL JSON Rules:**
1. Your output MUST be a single, valid JSON object that strictly adheres to the provided schema. 
2. Do NOT include any markdown formatting (like \`\`\`json) or explanatory text outside of the JSON object. 
3. Ensure that any special characters are properly escaped for JSON.
4. For any math, you MUST double-escape backslashes (e.g., \\\\alpha) to ensure valid JSON.
`;

const getPreviousLessonsContext = (curriculum: Curriculum, previousLessons: LessonPlan[]): string => {
    if (!previousLessons || previousLessons.length === 0) {
        return '';
    }
    const previousLessonsJSON = JSON.stringify(
        previousLessons.map((plan, index) => ({
            lessonTitle: curriculum.content.lessons[index],
            learningObjectives: plan.learningObjectives,
            overview: plan.overview,
        })), 
    null, 2);

    return `
**CONTEXT from Previous Lessons:**
Use this to ensure continuity and avoid repetition.
\`\`\`json
${previousLessonsJSON}
\`\`\`
`;
};

// 1. Overview
export const getOverviewPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    previousLessons: LessonPlan[]
): string => {
    return `You are an expert instructional designer. 
**Task:** Generate the **Overview** section for the lesson titled "${lesson}" from the curriculum "${curriculum.title}".

${getBaseContext(curriculum, options)}
${getPreviousLessonsContext(curriculum, previousLessons)}

**Requirement:**
- **overview**: Markdown. Write a compelling introduction. Include Purpose, Real-world relevance, and Links to Course Intended Learning Outcomes (ILOs).

${getJsonRules()}
`;
};

// 2. Learning Objectives
export const getLearningObjectivesPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    overview: string
): string => {
    return `You are an expert instructional designer.
**Task:** Generate the **Learning Objectives** for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context (Overview):**
"${overview}"

**Requirement:**
- **learningObjectives**: Array of strings. List 3-5 clear objectives. Each LO must contain a Verb from Bloom’s Taxonomy appropriate for the difficulty level and a clear performance expectation. Ensure complexity aligns with the Zone of Proximal Development (ZPD) for the difficulty level.

${getJsonRules()}
`;
};

// 3. Activation
export const getActivationPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    overview: string,
    objectives: string[]
): string => {
    return `You are an expert instructional designer.
**Task:** Generate the **Activation** phase for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context:**
- Overview: "${overview}"
- Objectives: ${JSON.stringify(objectives)}

**Requirement:**
- **activation**: Markdown. (5-10 min). Elicit prior knowledge and workplace experience. Connect lesson to real problems (Merrill's First Principles). Assess the learner's current standing to bridge the gap to new knowledge (ZPD).

${getJsonRules()}
`;
};

// 4. Demonstration
export const getDemonstrationPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    overview: string,
    objectives: string[],
    activation: string
): string => {
    return `You are an expert instructional designer.
**Task:** Generate the **Demonstration** phase for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context:**
- Overview: "${overview}"
- Objectives: ${JSON.stringify(objectives)}
- Activation: "${activation.substring(0, 300)}..."

**Requirement:**
- **demonstration**: Markdown. (10-15 min). Act as the More Knowledgeable Other (MKO). Show expert modelling. Provide examples of quality performance. Use code blocks for technical demonstrations.

${getJsonRules()}
`;
};

// 5. Application
export const getApplicationPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    overview: string,
    objectives: string[],
    demonstration: string
): string => {
    return `You are an expert instructional designer.
**Task:** Generate the **Application** phase (Core Activity) for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context:**
- Overview: "${overview}"
- Objectives: ${JSON.stringify(objectives)}
- Demonstration Summary: "${demonstration.substring(0, 300)}..."

**Requirement:**
- **application**: Markdown. Authentic task mirroring real practice. Tools/tech as affordances. Scaffolded support (Billett/Vygotsky). If appropriate, suggest how this could be done collaboratively (Social Interaction).

${getJsonRules()}
`;
};

// 6. Integration
export const getIntegrationPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    application: string
): string => {
    return `You are an expert instructional designer.
**Task:** Generate the **Integration** phase for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context:**
- Application Summary: "${application.substring(0, 300)}..."

**Requirement:**
- **integration**: Markdown. (Extension / Transfer). Learners apply concepts in a *new* or *unfamiliar* context. Encourage sense-making and peer sharing (Social Interaction).

${getJsonRules()}
`;
};

// 7. Feedback & Reflection
export const getReflectionPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    integration: string
): string => {
    return `You are an expert instructional designer.
**Task:** Generate the **Feedback & Reflection** section for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context:**
- Integration Summary: "${integration.substring(0, 300)}..."

**Requirement:**
- **reflectionAndAssessment**: Markdown. Include Feedback & Judgement Cycle (Self-assessment, Peer critique, Criteria comparison) AND Reflection questions. Incorporate Vygotsky's social constructivism by encouraging discussion.

${getJsonRules()}
`;
};

// 8. Exercises
export const getExercisesPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    application: string
): string => {
    return `You are an expert instructional designer.
**Task:** Generate **Exercises** for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context:**
- Application Phase: "${application.substring(0, 500)}..."

**Requirement:**
- **exercises**: Generate exactly ${options.exercisesPerLesson} exercise(s). These should reinforce the Application phase. Include Problem, Hint, Answer (code/text), and Explanation. The Hint should provide Scaffolding to keep the learner in their Zone of Proximal Development (ZPD).

${getJsonRules()}
`;
};

// 9. Quiz
export const getQuizPrompt = (
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    objectives: string[],
    demonstration: string
): string => {
    return `You are an expert instructional designer.
**Task:** Generate a **Quiz** for the lesson titled "${lesson}".

${getBaseContext(curriculum, options)}

**Context:**
- Objectives: ${JSON.stringify(objectives)}
- Content Summary: "${demonstration.substring(0, 500)}..."

**Requirement:**
- **quiz**: Generate exactly ${options.quizQuestionsPerLesson} quiz question(s). These should test the Learning Objectives. For options/answers with HTML or code, enclose in backticks (e.g., "\`<p>\`"). The Explanation should act as the MKO, clarifying misconceptions.

${getJsonRules()}
`;
};
