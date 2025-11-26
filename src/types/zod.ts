
import { z } from 'zod';

// For trending topics
export const TrendingTopicsSchema = z.object({
  topics: z.array(z.string()),
});

// For new Trending Feature
export const IndustryTrendSchema = z.object({
  topic: z.string(),
  description: z.string(),
  detailedDescription: z.string(),
  trendData: z.array(z.number()),
  sources: z.array(z.object({
    web: z.object({
      uri: z.string(),
      title: z.string(),
    })
  })).optional(),
});

export const IndustryTrendsResponseSchema = z.object({
  trends: z.array(IndustryTrendSchema),
});

export const TrendDataSchema = z.object({
  trendData: z.array(z.number()),
});

// For LessonPlan and its parts
export const ExerciseSchema = z.object({
  problem: z.string(),
  hint: z.string(),
  answer: z.string(),
  explanation: z.string(),
});

export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  answer: z.string(),
  explanation: z.string(),
});

export const QuizSchema = z.object({
  questions: z.array(QuizQuestionSchema),
});

export const ProjectSchema = z.object({
  description: z.string(),
  objective: z.string(),
  deliverables: z.array(z.string()),
});

export const LessonPlanSchema = z.object({
  lessonOutcome: z.string(),
  lessonOutline: z.string(),
  exercises: z.array(ExerciseSchema),
  quiz: QuizSchema,
  project: ProjectSchema,
});

// For Generation Options
export const GenerationOptionsSchema = z.object({
    model: z.string(),
    style: z.string(),
    exercisesPerLesson: z.string(),
    quizQuestionsPerLesson: z.string(),
    lessonDuration: z.string(),
    codeExamples: z.boolean(),
    visualElements: z.boolean(),
    instructions: z.string(),
});

// For Content Library
export const LessonSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export const ContentItemSchema = z.object({
    id: z.number(),
    name: z.string(),
    lessonCount: z.number(),
    lessonDuration: z.number(),
    difficulty: z.string(),
    created: z.string(),
    notes: z.string().optional(),
    generationOptions: GenerationOptionsSchema,
    lessons: z.array(LessonSchema),
    progress: z.number().optional(),
});

// For Curriculum
export const CurriculumContentSchema = z.object({
    lessons: z.array(z.string()),
    capstoneProjects: z.array(z.string()).optional(),
});

export const CurriculumSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  learningOutcomes: z.array(z.string()),
  recommended: z.boolean(),
  content: CurriculumContentSchema,
});

export const GenerateCurriculumResponseSchema = z.object({
  curriculums: z.array(CurriculumSchema),
  agentThoughts: z.array(z.string()),
});

// For Capstone Projects
export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
};

export const FileNodeSchema: z.ZodType<FileNode> = z.lazy(() => z.object({
  name: z.string(),
  type: z.enum(['file', 'folder']),
  content: z.string().optional(),
  children: z.array(FileNodeSchema).optional(),
}));

export const ProjectFilesDataSchema = z.object({
  fileStructure: z.array(FileNodeSchema),
});

export const DetailedProjectDataSchema = z.object({
    detailedDescription: z.string(),
    techStack: z.array(z.string()),
    learningOutcomes: z.array(z.string()),
    projectRequirements: z.array(z.string()),
    deliverables: z.array(z.string()),
});

export const CapstoneProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  industry: z.string(),
  tags: z.array(z.string()),
  recommended: z.boolean(),
  detailedDescription: z.string(),
  techStack: z.array(z.string()),
  learningOutcomes: z.array(z.string()),
  projectRequirements: z.array(z.string()),
  deliverables: z.array(z.string()),
  fileStructure: z.array(FileNodeSchema).optional(),
});

export const CapstoneProjectOutlineSchema = CapstoneProjectSchema.omit({ 
    id: true, 
    detailedDescription: true, 
    fileStructure: true,
    industry: true
});

export const GenerateCapstoneProjectsResponseSchema = z.object({
  projects: z.array(CapstoneProjectOutlineSchema),
  agentThoughts: z.array(z.string()),
});

// For Regeneration
export const LessonOutcomeSchema = z.object({ lessonOutcome: z.string() });
export const LessonOutlineSchema = z.object({ lessonOutline: z.string() });
export const LessonTitleSchema = z.object({ lessonTitle: z.string() });
export const CurriculumTitleSchema = z.object({ curriculumTitle: z.string() });

// Schemas for detailed project part regeneration
export const DetailedDescriptionSchema = DetailedProjectDataSchema.pick({ detailedDescription: true });
export const TechStackSchema = DetailedProjectDataSchema.pick({ techStack: true });
export const LearningOutcomesSchema = DetailedProjectDataSchema.pick({ learningOutcomes: true });
export const ProjectRequirementsSchema = DetailedProjectDataSchema.pick({ projectRequirements: true });
export const DeliverablesSchema = DetailedProjectDataSchema.pick({ deliverables: true });

// For varied lesson generation
export const VariedCurriculumOutlineSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    lessons: z.array(z.string()),
});

// For prompt suggestions
export const PromptSuggestionSchema = z.object({
    summary: z.string(),
    suggestion: z.string(),
});
