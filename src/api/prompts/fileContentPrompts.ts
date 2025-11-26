import type { CapstoneProject } from '../../types';

export const getDefaultFileContentPrompt = (
    project: CapstoneProject,
    filePath: string
): string => {
    return `You are an expert software developer. Based on the project specification, generate the full content for the file \`${filePath}\`.

**Project Specification:**
- **Title:** ${project.title}
- **Description:** ${project.detailedDescription}
- **Tech Stack:** ${project.techStack.join(', ')}
- **Full File Structure (for context):**
\`\`\`json
${JSON.stringify(project.fileStructure, null, 2)}
\`\`\`

**Your Task:**
Generate the complete and correct code for the file \`${filePath}\`.
- Ensure the code is production-quality and adheres to best practices for the given tech stack.
- The code must be fully functional within the context of the project structure.
- Do not include any placeholder comments like "// Your code here". Write the full implementation.

Your output MUST be a single, valid JSON object that strictly adheres to the provided schema. The content property should contain the full file content as a single string. Ensure all characters within the content string are properly escaped for JSON (e.g., backslashes as \\\\, double quotes as \\", newlines as \\n).`;
};
