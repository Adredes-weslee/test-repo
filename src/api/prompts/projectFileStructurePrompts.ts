import type { CapstoneProject } from '../../types';

export const getProjectFileStructurePrompt = (project: CapstoneProject): string => {
  return `You are an expert software architect. Based on the following detailed capstone project specification, generate a complete file and folder structure.

**Project Specification:**
- **Title:** ${project.title}
- **Description:** ${project.detailedDescription}
- **Industry:** ${project.industry}
- **Tech Stack:** ${project.techStack.join(', ')}
- **Learning Outcomes:**\n${project.learningOutcomes.map(o => `- ${o}`).join('\n')}
- **Project Requirements:**\n${project.projectRequirements.map(r => `- ${r}`).join('\n')}
- **Deliverables:**\n${project.deliverables.map(d => `- ${d}`).join('\n')}

**Your Task:**
Generate a complete file and folder structure for this project.
- You MUST create two root files: \`README.md\` and \`SETUP.md\`.
- \`README.md\` will contain project details, instructions on how to run the project, and how to deploy it. It MUST mention that setup instructions are in \`SETUP.md\`.
- \`SETUP.md\` will contain one-time setup instructions like prerequisites, environment variable setup, and dependency installation.
- CRITICAL: For this initial structure generation, the "content" property for EVERY file (including README.md and SETUP.md) MUST be an empty string ("").
- CRITICAL: Do NOT include any binary files such as images (.png, .jpg, .svg, .ico), PDFs, videos, or fonts. If a document like a PDF is requested or appropriate, generate a markdown (.md) file instead. You can include placeholders in HTML/CSS if needed, but do not include the binary files themselves in the structure.

Your output MUST be a single, valid JSON object that strictly adheres to the provided schema, with the "content" of all files being empty strings. Do not include any markdown or explanatory text outside the JSON object.
`;
};
