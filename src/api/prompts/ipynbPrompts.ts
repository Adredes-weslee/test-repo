import type { CapstoneProject } from '../../types';

export interface IpynbCellPart {
    cellType: 'markdown' | 'code';
    description: string;
}

export const getIpynbPlanPrompt = (project: CapstoneProject, filePath: string): string => {
    return `You are a data scientist and expert instructional designer. For the Jupyter Notebook \`${filePath}\` in a "${project.title}" project, outline the necessary cells. Describe the purpose of each cell. Return a JSON array of objects, each with a "cellType" ("markdown" or "code") and a "description". Markdown cells should explain concepts and code, while code cells should perform specific tasks.`;
};

export const getIpynbCellPrompt = (project: CapstoneProject, filePath: string, part: IpynbCellPart): string => {
    return `You are an expert software developer and data scientist. Based on the project specification, generate a specific cell for a Jupyter Notebook.

**Project Specification:**
- **Title:** ${project.title}
- **Description:** ${project.detailedDescription}
- **Tech Stack:** ${project.techStack.join(', ')}
- **Full File Structure (for context):**
\`\`\`json
${JSON.stringify(project.fileStructure, null, 2)}
\`\`\`

**Your Task:**
Generate the content for the following cell in the Jupyter Notebook \`${filePath}\`:
- **Cell Type:** ${part.cellType}
- **Cell Description:** ${part.description}

Your output MUST be a single, valid JSON object that strictly adheres to the provided schema. The "source" property should contain the full cell content as a single string. Ensure all characters within the content string are properly escaped for JSON (e.g., backslashes as \\\\, double quotes as \\", newlines as \\n). Do NOT include markdown fences in the code.`;
};
