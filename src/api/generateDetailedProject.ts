import { ai } from '../core/api/client';
import { 
    detailedDescriptionSchema,
    learningOutcomesSchema,
    projectRequirementsSchema,
    techStackSchema,
    deliverablesSchema,
    constraintsSchema,
    futureOrientedElementSchema,
    participationModelSchema,
    evidenceOfLearningSchema,
    assessmentFeedbackSchema,
    judgementCriteriaSchema
} from './schema';
import { 
    DetailedDescriptionSchema,
    LearningOutcomesSchema,
    ProjectRequirementsSchema,
    TechStackSchema,
    DeliverablesSchema,
    ConstraintsSchema,
    FutureOrientedElementSchema,
    ParticipationModelSchema,
    EvidenceOfLearningSchema,
    AssessmentFeedbackSchema,
    JudgementCriteriaSchema
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

const arrayFields: (keyof DetailedProjectData)[] = [
    'learningOutcomes',
    'techStack',
    'projectRequirements',
    'deliverables',
    'constraints',
    'evidenceOfLearning',
    'judgementCriteria'
];

const generationPlan: { part: keyof DetailedProjectData, schema: any, zodSchema: z.ZodSchema<any>, guideline: string }[] = [
    {
        part: 'detailedDescription',
        schema: detailedDescriptionSchema,
        zodSchema: DetailedDescriptionSchema,
        guideline: `1.  **detailedDescription (Project Brief):** Write a comprehensive description in markdown format. This is an **Authentic Challenge**.
    - Start with a level-2 heading \`## Project Brief\` providing a summary of the real-world industry challenge.
    - Follow with a level-2 heading \`## Scenario\`. Use a markdown blockquote (\`>\`) to frame the client brief or product roadmap.
    - Then, a level-2 heading \`## Core Features\` with a detailed feature list.
    - Conclude with a level-2 heading \`## Key Technical Considerations\` to highlight important architectural decisions.`
    },
    {
        part: 'learningOutcomes',
        schema: learningOutcomesSchema,
        zodSchema: LearningOutcomesSchema,
        guideline: `2. **learningOutcomes:** Refine the learning outcomes. Ensure they align with the activities and are measurable.`
    },
    {
        part: 'techStack',
        schema: techStackSchema,
        zodSchema: TechStackSchema,
        guideline: `3.  **techStack:** Confirm the tech stack. This defines the "Materially Mediated" aspect of practice. Be decisive (e.g., "React 18", "PostgreSQL").`
    },
    {
        part: 'projectRequirements',
        schema: projectRequirementsSchema,
        zodSchema: ProjectRequirementsSchema,
        guideline: `4. **projectRequirements:** Create a detailed, itemized list of functional and non-functional requirements. Ensure these reflect professional standards.`
    },
    {
        part: 'deliverables',
        schema: deliverablesSchema,
        zodSchema: DeliverablesSchema,
        guideline: `5.  **deliverables:** List the required deliverables. Must include the "Final Artefact" and a "Reflection/Judgement Component".`
    },
    {
        part: 'evidenceOfLearning',
        schema: evidenceOfLearningSchema,
        zodSchema: EvidenceOfLearningSchema,
        guideline: `6.  **evidenceOfLearning:** List the concrete evidence students must produce. This includes Artefacts (code, design docs), Demonstrations (video walkthrough), and Self-evaluation reports.`
    },
    {
        part: 'constraints',
        schema: constraintsSchema,
        zodSchema: ConstraintsSchema,
        guideline: `7.  **constraints:** List the constraints that frame the authentic practice. Include Tools (e.g., "Must use VS Code"), Data (e.g., "Use provided CSV dataset"), Roles (e.g., "Act as a Senior Backend Dev"), Timeline (e.g., "2-week sprint simulation"), and Workplace Conditions.`
    },
    {
        part: 'judgementCriteria',
        schema: judgementCriteriaSchema,
        zodSchema: JudgementCriteriaSchema,
        guideline: `8.  **judgementCriteria:** List specific quality expectations and observable performance indicators. How should the learner judge if their work is "good"?`
    },
    {
        part: 'assessmentFeedback',
        schema: assessmentFeedbackSchema,
        zodSchema: AssessmentFeedbackSchema,
        guideline: `9.  **assessmentFeedback:** Describe the assessment strategy. CRITICAL: You MUST include a "Marking Rubric" formatted as a Markdown table (cols: Criteria, Weight, Proficient, Competent, Needs Improvement). Also include "Formative Checkpoints" and "Feedback Mechanisms".`
    },
    {
        part: 'participationModel',
        schema: participationModelSchema,
        zodSchema: ParticipationModelSchema,
        guideline: `10.  **participationModel:** Describe the participation trajectory based on Stephen Billett's work. How does the learner move from Observing to Assisting to Performing?`
    },
    {
        part: 'futureOrientedElement',
        schema: futureOrientedElementSchema,
        zodSchema: FutureOrientedElementSchema,
        guideline: `11.  **futureOrientedElement:** Describe a specific element of the project that requires "Learning-to-Learn" or adaptability. This could be an unfamiliar scenario, a requirement to use a very new library with sparse documentation, or an inquiry-based task.`
    }
];

export async function* generateDetailedProjectParts(
  project: CapstoneProject,
): AsyncGenerator<DetailedProjectPart, void, undefined> {
  
    const filteredGenerationPlan = (project.techStack && project.techStack.length > 0)
        ? generationPlan
        : generationPlan.filter(p => p.part !== 'techStack');

    for (const { part, schema, zodSchema, guideline } of filteredGenerationPlan) {
        // Resume Logic: Skip if part is already populated
        const existingData = project[part];
        const isPopulated = Array.isArray(existingData) 
            ? existingData.length > 0 
            : (typeof existingData === 'string' && existingData.trim().length > 0);
            
        if (isPopulated) {
            continue;
        }

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
            // Yield an empty part to avoid stopping the whole process and ensure type safety
            const isArray = arrayFields.includes(part);
            const emptyValue: any = isArray ? [] : '';
            yield { part, data: { [part]: emptyValue } };
        }
    }
}