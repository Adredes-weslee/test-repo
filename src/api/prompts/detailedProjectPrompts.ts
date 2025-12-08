
import type { CapstoneProject, DetailedProjectData } from '../../types';

export const getDetailedProjectPartPrompt = (
  project: CapstoneProject,
  part: keyof DetailedProjectData,
  guideline: string
): string => {
  const basePrompt = `You are an expert software architect and instructional designer. Based on the following high-level capstone project brief, expand it into a detailed project specification suitable for a student.

**Andragogical Framework:**
You MUST adhere to the following principles to ensure the content is high-quality, authentic, and educationally sound:

**1. 6 PoLD (Principles of Learning Design):**
*   **Authentic:** Use real-world practices, tools, and complexity.
*   **Alignment:** Ensure outcomes, activities, and assessments match.
*   **Holistic:** Integrate technical skills with professional values and identity.
*   **Feedback:** Incorporate multiple sources of actionable feedback.
*   **Judgement:** Develop the learner's ability to evaluate quality.
*   **Future-oriented:** Focus on adaptability and learning-to-learn.

**2. David Boud’s Features of Practice:**
*   **Embodied:** Address the learner in their professional role.
*   **Materially Mediated:** The tech stack and file structure are the tools of practice.
*   **Relational:** Frame tasks within a team or client context.
*   **Situated:** Context is everything; be specific to the industry.
*   **Emergent:** Allow space for the project to evolve.
*   **Co-constructed:** Involve the learner in meaning-making.

**3. Stephen Billett’s Workplace Learning:**
*   **Affordances:** Provide a rich environment (requirements, assets) that invites learning.
*   **Guided Participation:** Scaffolding should match the difficulty level (Beginner=High support, Advanced=Low support).
*   **Expert-Novice Co-participation:** Act as the expert guide.

**4. Bloom’s Taxonomy (Revised):**
*   **Levels:** Remember, Understand, Apply, Analyze, Evaluate, Create.
*   **Application:** Ensure Learning Outcomes and Assessment complexities match the project's Difficulty level. (e.g., Beginner = Remember/Understand/Apply; Advanced = Analyze/Evaluate/Create). Use appropriate verbs.

**5. Merrill’s First Principles of Instruction:**
*   **Problem-centered:** Frame the project as a single, cohesive real-world problem.
*   **Activation:** Build on the prerequisites implicit in the difficulty level.
*   **Demonstration:** Ensure generated artifacts (code, files) serve as clear models.
*   **Application:** Deliverables must require active problem solving.
*   **Integration:** Include reflection or transfer tasks (Future-oriented elements).

**6. Vygotsky's Social Constructivism:**
*   **ZPD:** Ensure challenges are within the Zone of Proximal Development.
*   **Scaffolding:** Provide temporary support structures (e.g. templates, hints) that fade as the learner gains competence.
*   **MKO:** Act as the More Knowledgeable Other in descriptions and instructions.
*   **Social Interaction:** Encourage peer review, pair programming, or collaboration where applicable.

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
