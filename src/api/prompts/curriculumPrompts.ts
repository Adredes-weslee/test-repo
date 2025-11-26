export const getCurriculumPrompt = (
  topic: string,
  filterInstructions: string,
  contentBreakdownInstruction: string,
  fileContextPrompt: string,
): string => {
  const basePrompt = `You are an expert instructional designer. For the topic "${topic}", create 6 distinct curriculum outlines. Each outline must be tailored for a different learning objective or audience (e.g., beginner-focused, project-based, for advanced developers, etc.).${filterInstructions} The first outline must be the most comprehensive and balanced, and it must be marked as "recommended: true". All other outlines must be marked "recommended: false". For every curriculum, you must provide: a concise title, a short description (2-3 sentences), 3-4 relevant tags, and a list of 4-5 key learning outcomes. The first tag must always be the difficulty level ('Beginner', 'Intermediate', or 'Advanced') and appropriately assigned based on actual difficulty. ${contentBreakdownInstruction} CRITICAL for JSON format: Ensure all characters are properly escaped. For example, any backslashes (\\) must be escaped as (\\\\). Do not use special formatting like LaTeX; write out symbols as text (e.g., "beta" instead of "\\beta"). Finally, provide a list of your "agent thoughts" explaining the reasoning behind the different curriculum variations you created.`;

  return `${basePrompt}\n\n${fileContextPrompt}`;
};
