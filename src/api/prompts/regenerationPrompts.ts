
import type { Curriculum, LessonPlan, GenerationOptions, RegenerationPart, CapstoneProject, DetailedProjectData } from '../../types';

const getPartName = (part: RegenerationPart): string => {
    switch (part.type) {
        case 'outcome': return 'the lesson outcome';
        case 'outline': return 'the lesson outline';
        case 'exercise': return `the exercise at index ${part.index}`;
        case 'quiz': return `the quiz question at index ${part.index}`;
        case 'project': return 'the capstone project';
        case 'title': return 'the lesson title';
        case 'curriculumTitle': return 'the curriculum title';
    }
}

const getBaseContext = (curriculum: Curriculum, options: GenerationOptions) => `
- Audience Difficulty: "${curriculum.tags.find(t => ['Beginner', 'Intermediate', 'Advanced'].includes(t)) || 'Beginner'}"
- Generation Style: "${options.style}"`;

const getCriticalRules = () => `
**CRITICAL Rules:**
1. The regenerated content MUST remain consistent with the overall context of the curriculum provided.
2. The output MUST be a single JSON object that strictly adheres to the provided schema.
3. Do NOT include any markdown formatting (like \`\`\`json) or explanatory text outside of the JSON object itself.
4. Ensure all special characters are properly escaped for JSON (e.g., double quotes as \\" and backslashes as \\\\).
5. Ensure any programming code within the JSON response is formatted using markdown code blocks inside the JSON strings. You MUST specify the programming language, for example: \`\`\`python ... \`\`\`.
6. For quiz questions, if an option or answer contains an HTML tag or code snippet, it MUST be enclosed in backticks for correct rendering (e.g., format an option as "\`<p>\`", not "<p>").`;


export const buildRegenerationPrompt = (
    curriculum: Curriculum,
    lessonPlan: LessonPlan | null,
    lessonTitle: string | null,
    partToRegenerate: RegenerationPart,
    instructions: string,
    options: GenerationOptions,
): string => {
    const partName = getPartName(partToRegenerate);
    const isCurriculumTitleRegen = partToRegenerate.type === 'curriculumTitle';
    const isCapstone = lessonTitle?.toLowerCase().includes('capstone') ?? false;

    let taskInstructions: string;

    if (isCapstone) {
        if (partToRegenerate.type === 'outline') {
            taskInstructions = `**Task:**\nRegenerate the lesson outline. Since this is a capstone project, the lesson outline MUST be an empty string (""). Do not generate any content for the outline.`;
        } else if (partToRegenerate.type === 'title') {
            const customInstructions = instructions.trim()
                ? `\n\n**Additional Instructions for Regeneration:**\n"${instructions}"`
                : '';
            taskInstructions = `**Task:**\nRegenerate the lesson title. The new title MUST start with the prefix "Capstone Project:".${customInstructions}`;
        } else {
            // Default behavior for other parts of a capstone project
            taskInstructions = instructions.trim()
                ? `**Task:**\nRegenerate ONLY ${partName}.\n\n**Instructions for Regeneration:**\n"${instructions}"`
                : `**Task:**\nRegenerate ONLY ${partName} to provide a different version or alternative. The new version should be of similar quality and style but offer a fresh perspective or approach.`;
        }
    } else {
        // Default behavior for non-capstone lessons
        taskInstructions = instructions.trim()
            ? `**Task:**\nRegenerate ONLY ${partName}.\n\n**Instructions for Regeneration:**\n"${instructions}"`
            : `**Task:**\nRegenerate ONLY ${partName} to provide a different version or alternative. The new version should be of similar quality and style but offer a fresh perspective or approach.`;
    }

    const contextPrompt = isCurriculumTitleRegen
        ? `**Full Context:**
  - Original Curriculum Title: "${curriculum.title}"
  - Curriculum Description: "${curriculum.description}"
  - Lesson Titles: ${curriculum.content.lessons.map(l => `"${l}"`).join(', ')}
  ${getBaseContext(curriculum, options)}`
        : `**Full Context:**
  - Curriculum Title: "${curriculum.title}"
  - Lesson Title: "${lessonTitle}"
  ${getBaseContext(curriculum, options)}
  - Original Full Lesson Plan (JSON format):
  \`\`\`json
  ${JSON.stringify(lessonPlan, null, 2)}
  \`\`\``;

    return `You are an expert instructional designer. You are tasked with regenerating a specific part of a curriculum.
  
${contextPrompt}

${taskInstructions}

${getCriticalRules()}
`;
}

export const buildNewPartPrompt = (
    curriculum: Curriculum,
    lessonPlan: LessonPlan,
    lessonTitle: string,
    partToGenerate: 'exercise' | 'quiz',
    options: GenerationOptions,
): string => {
    const partName = partToGenerate === 'exercise' ? 'an exercise' : 'a quiz question';

    return `You are an expert instructional designer. You are tasked with generating a new part of a lesson plan.
  
**Context:**
  - Curriculum Title: "${curriculum.title}"
  - Lesson Title: "${lessonTitle}"
  ${getBaseContext(curriculum, options)}
  - Existing Full Lesson Plan (JSON format for context):
  \`\`\`json
  ${JSON.stringify(lessonPlan, null, 2)}
  \`\`\`

**Task:**
Generate a single new, high-quality, and relevant ${partName} for the lesson described above. The new content should be distinct from any existing content in the lesson plan.

${getCriticalRules()}
`;
}

export const buildProjectFileRegenerationPrompt = (
    project: CapstoneProject,
    instructions: string
): string => {
    return `You are an expert software architect. You are tasked with modifying a project's file structure and code based on user instructions.

**Project Context:**
- **Title:** ${project.title}
- **Description:** ${project.detailedDescription}
- **Tech Stack:** ${project.techStack.join(', ')}
- **Learning Outcomes:**\n${project.learningOutcomes.map(o => `- ${o}`).join('\n')}
- **Project Requirements:**\n${project.projectRequirements.map(r => `- ${r}`).join('\n')}
- **Deliverables:**\n${project.deliverables.map(d => `- ${d}`).join('\n')}

**Current File Structure (as a JSON object):**
\`\`\`json
${JSON.stringify(project.fileStructure, null, 2)}
\`\`\`

**User Instructions:**
"${instructions}"

**Your Task:**
Based on the user's instructions, modify the file structure and/or the content of the files.
- If the instructions affect the project's core details (like adding a new feature), you MUST update the relevant sections in \`README.md\` (like Overview or Requirements).
- If the instructions affect how to run, build, or deploy the project, you MUST update the 'Running the Project', 'Building for Production', or 'Deployment' sections in \`README.md\`.
- If the instructions affect dependencies, environment setup, or one-time initialization (e.g., adding a new library, changing required environment variables), you MUST update the 'Prerequisites', 'Installation', or 'Configuration' sections in \`SETUP.md\`.

Your response MUST be the complete, updated file structure as a single JSON object adhering to the provided schema. Do not include any markdown or explanatory text outside the JSON object. Ensure all special characters are properly escaped for JSON, especially backslashes (\\\\) and double quotes (\\").
`;
};

export const buildProjectPartRegenerationPrompt = (
    project: CapstoneProject,
    partToRegenerate: keyof DetailedProjectData,
    instructions: string,
): string => {
    const taskInstructions = instructions.trim()
        ? `**Task:**\nRegenerate ONLY the \`${String(partToRegenerate)}\` section.\n\n**Instructions for Regeneration:**\n"${instructions}"`
        : `**Task:**\nRegenerate ONLY the \`${String(partToRegenerate)}\` section to provide a different version or alternative. The new version should be of similar quality and style but offer a fresh perspective or approach.`;

    const guidelines: Record<string, string> = {
        detailedDescription: `The 'detailedDescription' must be in markdown format and include sections for "Project Overview", "Scenario", "Core Features", and optionally "Key Technical Considerations".`,
        techStack: `The 'techStack' must be a decisive list of technologies. Do not suggest alternatives.`,
        learningOutcomes: `The 'learningOutcomes' should be a list of 4-6 specific, measurable outcomes.`,
        projectRequirements: `The 'projectRequirements' should be a detailed, itemized list of functional and non-functional requirements.`,
        deliverables: `The 'deliverables' should be a detailed list of professional-quality deliverables.`
    };

    return `You are an expert software architect and instructional designer. You are tasked with regenerating a specific part of a capstone project specification.
  
**Full Project Context:**
- **Title:** ${project.title}
- **Description (High-level):** ${project.description}
- **Original Full Specification (JSON format):**
\`\`\`json
${JSON.stringify({
    detailedDescription: project.detailedDescription,
    techStack: project.techStack,
    learningOutcomes: project.learningOutcomes,
    projectRequirements: project.projectRequirements,
    deliverables: project.deliverables,
}, null, 2)}
\`\`\`

${taskInstructions}

**Guideline for this part:** ${guidelines[partToRegenerate as string] || ''}

**CRITICAL Rules:**
1. Your output MUST be a single JSON object that strictly adheres to the provided schema for the requested part.
2. Do NOT include any markdown formatting (like \`\`\`json) or explanatory text outside of the JSON object itself.
3. Ensure all special characters are properly escaped for JSON.
`;
};
