
import type { CapstoneProject, DetailedProjectData } from '../../types';

export const getDetailedProjectPartPrompt = (
  project: CapstoneProject,
  part: keyof DetailedProjectData,
  guideline: string
): string => {
  const basePrompt = `You are an expert software architect and instructional designer. Based on the following high-level capstone project brief, expand it into a detailed project specification suitable for a student.

**Project Brief:**
- **Title:** ${project.title}
- **Description:** ${project.description}
- **Industry:** ${project.industry}
- **Difficulty:** ${project.tags.find(t => ['Beginner', 'Intermediate', 'Advanced'].includes(t)) || 'Beginner'}
- **Initial Tech Stack:** ${project.techStack.join(', ')}
- **Initial Requirements:** ${project.projectRequirements.join('; ')}
- **Initial Deliverables:** ${project.deliverables.join('; ')}
- **Initial Learning Outcomes:** ${project.learningOutcomes.join('; ')}

Your output MUST be a single, valid JSON object that strictly adheres to the provided schema. Ensure all special characters are properly escaped for JSON, especially backslashes (\\\\) and double quotes (\\").`;

  return `${basePrompt}

**Your Task:**
Generate ONLY the \`${String(part)}\` part of the project specification. Follow this guideline:
${guideline}`;
};
