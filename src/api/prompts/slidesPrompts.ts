
export const getSlidesPrompt = (
    topic: string,
    contentContext: string,
    referenceFileContext: string = '',
    scope: 'course' | 'lesson' = 'course'
): string => {
    let structureInstruction = '';
    
    if (scope === 'course') {
        structureInstruction = `Generate a comprehensive slide deck summarizing the entire course. The deck should have approximately 8-12 slides. Create one slide for each main lesson or key topic found in the context. Include a Title Slide at the beginning and a Thank You slide at the end.`;
    } else {
        structureInstruction = `Generate a detailed slide deck for the lesson: "${topic}".
        
        CRITICAL: Address the following sections found in the lesson plan content.
        
        **Slide Count Guideline:** Do NOT limit each section to a single slide. If a section (like Demonstration, Application, or Exercises) contains dense content, complex steps, code blocks, or multiple distinct points, you MUST split it across multiple slides to adhere to **Mayer's Coherence Principle**. Avoid overcrowding slides with text. Use as many slides as necessary to present the information clearly.
        
        Required Slide Flow:
        1. Title Slide (Start Page with Lesson Title). Set layoutSuggestion to "Title Only".
        2. Overview (Purpose & Relevance)
        3. Learning Objectives
        4. Activation (Prior Knowledge)
        5. Demonstration (Modelling/Examples). **Likely requires multiple slides.**
        6. Application (Core Task). **Likely requires multiple slides.**
        7. Integration (Transfer)
        8. Feedback & Reflection
        9. Exercises. Create separate slides for each exercise if needed.
        10. Quiz. Create separate slides for each question.
        11. Thank You Page (End Page). Set layoutSuggestion to "Center".

        Ensure the content from the provided lesson plan is accurately reflected in the bullets and speaker notes.`;
    }

    const referenceInstruction = referenceFileContext 
        ? `\n**Design Reference:** The user has provided a reference file context. While you cannot see the visual design directly, adapt the tone and structure based on this file description if available: "${referenceFileContext}". If this is empty, generate a high-quality professional design from scratch.`
        : `\n**Design Reference:** No reference provided. Create a professional, clean, and engaging presentation structure from scratch.`;

    return `You are an expert instructional designer and presentation specialist. 
**Task:** Generate a slide deck outline for: "${topic}".

**Context:**
${contentContext.substring(0, 5000)}... (truncated if too long)

**Requirements:**
1. ${structureInstruction}
2. Adhere strictly to **Mayer’s Multimedia Principles**:
   - **Coherence Principle:** Exclude extraneous words, pictures, and sounds. Keep bullets concise.
   - **Signaling Principle:** Highlight essential material.
   - **Spatial Contiguity:** Suggest placing corresponding words and pictures near each other in the \`visualDescription\`.
3. Adhere to **Universal Design for Learning (UDL)**:
   - **Multiple Means of Representation:** Provide options for perception. Ensure the \`visualDescription\` includes text alternatives for images.
   - **Clarity:** Suggest high contrast and readable layouts in \`layoutSuggestion\`.
4. **Plain Text Only:** Do NOT use Markdown formatting (like **, *, _, #, \`, [], etc.) in the \`title\` or \`bullets\` fields. These must be clean, plain strings ready for a slide deck. If code is necessary, write it as plain text without backticks. Do not include list markers (like -, *) at the start of bullet strings.

${referenceInstruction}

**Output:**
Return a valid JSON object with an array of slides and a design rationale.
For each slide, include:
- \`title\`: Clear, descriptive title.
- \`bullets\`: Array of short, punchy text points (max 5 per slide).
- \`speakerNotes\`: Narrative script for the presenter.
- \`visualDescription\`: Detailed description of the visual elements (charts, icons, layout).
- \`layoutSuggestion\`: e.g., "Title Only", "Title and Content", "Two Column", "Big Number", "Image Right".

CRITICAL: JSON format only. Escape special characters.
`;
};

export const getSectionSlidesPrompt = (
    sectionTitle: string,
    sectionContent: string,
    referenceFileContext: string = ''
): string => {
    // Regex to strip "Section X: ", "Section X ", "X. ", "X: " prefix, and ensure clean title
    const cleanedTitle = sectionTitle.replace(/^(Section\s+\d+|\d+)[\.\:\s]*\s*/i, '').trim();
    // Specific rule for Quiz
    const isQuiz = cleanedTitle.toLowerCase().includes('quiz');
    const displayTitle = isQuiz ? "Quiz" : cleanedTitle;

    const referenceInstruction = referenceFileContext 
        ? `\n**Design Reference:** Adapt tone based on: "${referenceFileContext}".`
        : ``;

    return `You are an expert instructional designer.
**Task:** Generate slides SPECIFICALLY for the section: "${displayTitle}".

**Content Source:**
${sectionContent}

**Requirements:**
1. Generate as many slides as necessary to cover this content clearly. Do not cram text. Split complex steps or distinct exercises into separate slides.
2. **Strict Adherence for Quizzes:**
   - If the content is a JSON object containing questions, you MUST create exactly ONE slide per question.
   - The slide 'title' must be the Question text.
   - The 'bullets' array must contain the Options.
   - The 'speakerNotes' must contain the correct Answer and the Explanation.
   - Do NOT omit any questions.
3. **Strict Adherence for Exercises:**
   - If the content is a JSON array of exercises, you MUST create exactly ONE slide per exercise.
   - The slide 'title' must be "Exercise [N]" or the Problem title.
   - The 'bullets' array must contain the Problem statement (broken down if needed).
   - The 'speakerNotes' must contain the Hint, Answer, and Explanation.
   - Do NOT omit any exercises.
4. **For all other sections:** Follow the source content strictly. Do not hallucinate new information. If the content describes a process or list, ensure all steps/items are covered across the slides.
5. If this is a "Title Slide" or "Start Page", create exactly one slide with "Title Only" layout. CRITICAL: The 'bullets' array MUST be empty. Do not include any body text, bullets, or subtitles on this slide. Just the main title.
6. Adhere to **Mayer’s Coherence Principle**: Concise bullets, no extraneous info.
7. **Slide Titles:** Do NOT prefix the slide title with the section name (e.g., do NOT write "Demonstration: Live Coding" or "Overview: Purpose"). Just write the specific topic title (e.g., "Live Coding", "Purpose of the Lesson"). The slide title should stand on its own and describe the content of that specific slide.
8. **Plain Text Only:** Do NOT use Markdown formatting (like **, *, _, #, \`) in the \`title\` or \`bullets\` fields. Provide clean text. Do not include list markers (like -, *) at the start of bullet strings.

${referenceInstruction}

**Output:**
Return a valid JSON object with an array of slides and a brief design rationale.
For each slide:
- \`title\`: Specific, descriptive title for the slide content. Do NOT include "${displayTitle}:" prefix.
- \`bullets\`: Array of strings.
- \`speakerNotes\`: Narrative script.
- \`visualDescription\`: Description of visuals.
- \`layoutSuggestion\`: "Title Only", "Title and Content", "Two Column", "Center", "Sidebar", or "Image Right".

CRITICAL: JSON format only.
`;
};
