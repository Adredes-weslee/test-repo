
export const getAndragogyAnalysisPrompt = (
    content: string,
    type: 'course' | 'project'
): string => {
    const typeLabel = type === 'course' ? 'educational course' : 'capstone project';
    
    return `You are an Expert Andragogical Auditor and Instructional Designer.
    
**Task:** Analyze the provided ${typeLabel} content and "prove" how it adheres to advanced andragogical frameworks. You must generate specific evidence based on the actual text provided.

**Content to Analyze:**
"${content.substring(0, 20000)}"

**Your Goal:**
For each principle below, provide a specific, 1-2 sentence explanation citing evidence from the content. Do NOT use generic definitions. Quote or reference specific tasks, tools, objectives, or sections from the content provided.

**Frameworks to Audit:**

1.  **6 PoLD (Principles of Learning Design):**
    *   **Authentic:** How does it mirror real-world tasks/complexity? (e.g., "Uses real patient data," "Simulates a sprint.")
    *   **Alignment:** How do Outcomes match Activities/Assessments?
    *   **Holistic:** How does it integrate Doing (technical), Thinking (architectural), and Feeling (professional identity)?
    *   **Feedback:** What mechanisms provide actionable feedback? (e.g., "Detailed hints in exercises," "Peer review rubric.")
    *   **Judgement:** How does the learner evaluate quality? (e.g., "Self-assessment checklist," "Performance indicators.")
    *   **Future-oriented:** How does it foster adaptability? (e.g., "Handling ambiguous requirements," "Transfer task.")

2.  **David Boud’s Features of Practice:**
    *   **Situated & Embodied:** How is the learner addressed in a professional role?
    *   **Materially Mediated:** What professional tools (IDE, Git, libraries) mediate the learning?
    *   **Relational:** How is the work framed within a team or client context?

3.  **Stephen Billett’s Workplace Learning:**
    *   **Affordances:** How does the environment/structure invite participation?
    *   **Guided Participation:** How is expert guidance scaffolded?

4.  **Merrill’s First Principles:**
    *   **Problem-centered:** Is there a cohesive real-world problem?
    *   **Activation:** How is prior knowledge triggered?
    *   **Demonstration:** Where is the expert modelling?
    *   **Application:** Where is the core problem-solving task?
    *   **Integration:** How is transfer to new contexts encouraged?

5.  **Bloom’s Taxonomy:**
    *   **Progression:** What cognitive levels are targeted? (e.g., "Moves from Understanding to Creating.")

6.  **Vygotsky's Social Constructivism:**
    *   **ZPD:** How does the difficulty align with the Zone of Proximal Development?
    *   **Scaffolding:** What support structures are in place (hints, templates)?
    *   **Social Interaction:** Is there an opportunity for collaboration or peer review?
    *   **MKO:** How does the content act as the More Knowledgeable Other?

**Output:**
Return a single valid JSON object matching the schema. Ensure all strings are plain text and concise.`;
};
