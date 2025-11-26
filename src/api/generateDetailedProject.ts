import { ai } from '../core/api/client';
import { 
    detailedDescriptionSchema,
    learningOutcomesSchema,
    projectRequirementsSchema,
    techStackSchema,
    deliverablesSchema
} from './schema';
import { 
    DetailedDescriptionSchema,
    LearningOutcomesSchema,
    ProjectRequirementsSchema,
    TechStackSchema,
    DeliverablesSchema
} from '../types/zod';
import { API_MODELS } from '../config';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import type { CapstoneProject, DetailedProjectData } from '../types';
import { getDetailedProjectPartPrompt } from './prompts';
import { z } from 'zod';

export type DetailedProjectPart = {
    part: keyof DetailedProjectData;
    data: Partial<DetailedProjectData>;
};

const generationPlan: { part: keyof DetailedProjectData, schema: any, zodSchema: z.ZodSchema<any>, guideline: string }[] = [
    {
        part: 'detailedDescription',
        schema: detailedDescriptionSchema,
        zodSchema: DetailedDescriptionSchema,
        guideline: `1.  **detailedDescription:** Write a comprehensive description in markdown format, structured with clear sections for readability. It MUST include the following structure:
    - Start with a level-2 heading \`## Project Overview\` providing a brief summary.
    - Follow with a level-2 heading \`## Scenario\`. Use a markdown blockquote (\`>\`) to frame a real-world brief (e.g., from a client or product manager).
    - Then, a level-2 heading \`## Core Features\` with a detailed, nested bulleted list of functionalities.
    - Conclude with an optional level-2 heading \`## Key Technical Considerations\` to highlight important architectural decisions or challenges.
    - Use bold text for emphasis on key terms throughout the description.`
    },
    {
        part: 'techStack',
        schema: techStackSchema,
        zodSchema: TechStackSchema,
        guideline: `2.  **techStack:** Confirm the tech stack. You may add specific libraries or versions if it adds clarity (e.g., "React 18", "Flask-SQLAlchemy"). The list MUST be decisive; do not suggest alternatives (e.g., use "PostgreSQL" instead of "PostgreSQL or MySQL").`
    },
    {
        part: 'learningOutcomes',
        schema: learningOutcomesSchema,
        zodSchema: LearningOutcomesSchema,
        guideline: `3.  **learningOutcomes:** Refine and expand the initial list into 4-6 specific, measurable learning outcomes.`
    },
    {
        part: 'projectRequirements',
        schema: projectRequirementsSchema,
        zodSchema: ProjectRequirementsSchema,
        guideline: `4.  **projectRequirements:** Create a detailed, itemized list of both functional and non-functional requirements. Be specific.`
    },
    {
        part: 'deliverables',
        schema: deliverablesSchema,
        zodSchema: DeliverablesSchema,
        guideline: `5.  **deliverables:** Create a detailed, itemized list of professional-quality deliverables (e.g., "Link to a live, hosted application", "Source code repository with a detailed README.md").`
    }
];

export async function* generateDetailedProjectParts(
  project: CapstoneProject,
): AsyncGenerator<DetailedProjectPart, void, undefined> {
  
    const filteredGenerationPlan = (project.techStack && project.techStack.length > 0)
        ? generationPlan
        : generationPlan.filter(p => p.part !== 'techStack');

    for (const { part, schema, zodSchema, guideline } of filteredGenerationPlan) {
        const prompt = getDetailedProjectPartPrompt(project, part, guideline);

        try {
            const response = await ai.models.generateContent({
                model: API_MODELS.GENERATE_DETAILED_PROJECT,
                contents: [prompt],
                config: {
                responseMimeType: 'application/json',
                responseSchema: schema
                }
            });
            const parsedJson = cleanAndParseJson(response.text);
            const data = zodSchema.parse(parsedJson);
            yield { part, data };
        } catch (error) {
            console.error(`Error generating detailed project part "${String(part)}":`, error);
            // Yield an error or an empty part to avoid stopping the whole process
            yield { part, data: { [part]: part === 'detailedDescription' ? 'Error generating content.' : [] } };
        }
    }
}