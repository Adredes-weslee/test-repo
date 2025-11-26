export const getPromptSuggestionPrompt = (userPrompt: string, type: 'course' | 'project'): string => {
    const generationGoal = type === 'course'
        ? 'a comprehensive and engaging educational course curriculum'
        : 'a detailed and practical capstone project specification';
    
    const courseSpecificInstructions = type === 'course' 
        ? `
- **CRITICAL for a course:** Your primary goal is to ensure the user's prompt includes ALL of the following key details for creating a well-structured course. Your completion MUST address the most important missing piece of information.
    1.  **Target Audience / Difficulty Level:** (e.g., "for beginners", "for advanced data scientists", "for high school students").
    2.  **Number of Lessons:** (e.g., "in 5 lessons", "a 10-part series").
    3.  **Duration per Lesson:** (e.g., "with 1-hour lessons").
    4.  **Course Objective:** A clear, measurable goal (e.g., "to build a fully functional e-commerce site", "to pass a certification exam").
- If any of these are missing, your completion **MUST** briefly and naturally guide the user to add the most critical missing one.
    - If the user has only stated a topic like "Create a course on Python", a good completion would be "...for absolute beginners in 10 one-hour lessons to learn data analysis."
    - If the user has provided a topic and audience, like "A Python course for beginners", a good completion would be "... in 8 lessons, covering the basics of programming and data structures."
- Prioritize adding the most impactful missing detail. Keep the suggestion concise.
- Do not need to indicate what the course culminate to, indicate the learning objective of the course instead.`
        : '';

    return `You are an expert prompt completion AI. Your task is to complete the user's prompt to make it more effective for generating educational content.

The user's goal is to generate: ${generationGoal}.

User's partial prompt: "${userPrompt}"

Your task is to complete the user's prompt. The completed prompt ("suggestion") MUST start with the exact text of the user's partial prompt. Then, continue it briefly to make it more effective.

**Guidelines for the completion:**
- **Be Brief and Natural:** The added text should be short, feeling like a natural sentence completion rather than a long, detailed example.
- **Guide, Don't Overwhelm:** Your goal is to hint at what information is missing, not to provide all of it.
- **Focus on Key Details:** If missing, suggest adding a target audience or scope.${courseSpecificInstructions}
- **Total Length:** The final suggested prompt must not exceed 80 words in total.

**CRITICAL: Your output MUST be a single, valid JSON object with two keys:**
1. "summary": A very short, 3-5 word summary of what you added (e.g., "Added Target Audience").
2. "suggestion": The full, completed prompt text. It MUST start with: "${userPrompt}"

Do not include any explanations, preambles, or markdown formatting like \`\`\`json.`;
};