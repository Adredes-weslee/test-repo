import type { CapstoneProject } from '../../types';

export interface ReadmePart {
    partName: string;
    description: string;
}

export const getReadmePartPrompt = (project: CapstoneProject, part: ReadmePart): string => {
    return `You are an expert technical writer. Based on the project specification, generate a specific section of a markdown file.

**Project Specification:**
- **Title:** ${project.title}
- **Description:** ${project.detailedDescription}
- **Tech Stack:** ${project.techStack.join(', ')}
- **Full File Structure (for context):**
\`\`\`json
${JSON.stringify(project.fileStructure, null, 2)}
\`\`\`

**Your Task:**
Generate the markdown content for the following section:
- **Section Name:** ${part.partName}
- **Section Description:** ${part.description}

Your output MUST be a single, valid JSON object that strictly adheres to the provided schema. The content property should contain the markdown for this section as a single string. Ensure all characters within the content string are properly escaped for JSON (e.g., newlines as \\n). Do NOT include the section heading unless specified in the description.`;
};
