
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
  // New Andragogical Structure
  overview: z.string().describe("Purpose, Real-world relevance, Links to Course ILOs"),
  learningObjectives: z.array(z.string()).describe("List of LOs with Bloom verbs"),
  
  // Merrill's Phases
  activation: z.string().describe("Elicit prior knowledge, workplace experience, connect to real problems"),
  demonstration: z.string().describe("Expert modelling, examples of quality performance"),
  application: z.string().describe("Authentic task mirroring real practice, tools/tech as affordances"),
  integration: z.string().describe("Apply concepts in new context, sense-making, decision justification"),
  
  // Closing loop
  reflectionAndAssessment: z.string().describe("Self-assessment, peer critique, reflection questions, formative micro-assessments"),
  
  // Interactive Elements (UI specific)
  exercises: z.array(ExerciseSchema),
  quiz: QuizSchema,
  
  // Legacy fields (optional for backward compatibility if needed, but we will mostly migrate)
  lessonOutcome: z.string().optional(), 
  lessonOutline: z.string().optional(),
  project: ProjectSchema.optional(),
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
    description: z.string().optional(),
    lessonCount: z.number(),
    lessonDuration: z.number(),
    difficulty: z.string(),
    created: z.string(),
    notes: z.string().optional(),
    generationOptions: GenerationOptionsSchema,
    lessons: z.array(LessonSchema),
    progress: z.number().optional(),
    tags: z.array(z.string()).optional(),
    learningOutcomes: z.array(z.string()).optional(),
});

// For Curriculum
export const CurriculumLessonSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
}).passthrough();

export const CurriculumModuleSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
  lessons: z.array(CurriculumLessonSchema).default([]),
}).passthrough();

export const CurriculumContentSchema = z.object({
  lessons: z.array(z.string()).default([]),
  capstoneProjects: z.array(z.string()).optional().default([]),
}).default({ lessons: [], capstoneProjects: [] });

export const CurriculumSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
  modules: z.array(CurriculumModuleSchema).default([]),
  tags: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  recommended: z.boolean().default(false),
  content: CurriculumContentSchema,
}).passthrough();

export const GenerateCurriculumResponseSchema = z.object({
  curriculums: z.array(CurriculumSchema),
  agentThoughts: z.array(z.string()).default([]),
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
    // New fields for Andragogical Template
    constraints: z.array(z.string()).optional(),
    futureOrientedElement: z.string().optional(),
    participationModel: z.string().optional(),
    evidenceOfLearning: z.array(z.string()).optional(),
    assessmentFeedback: z.string().optional(),
    judgementCriteria: z.array(z.string()).optional(),
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
  // New fields for Andragogical Template
  constraints: z.array(z.string()).optional(),
  futureOrientedElement: z.string().optional(),
  participationModel: z.string().optional(),
  evidenceOfLearning: z.array(z.string()).optional(),
  assessmentFeedback: z.string().optional(),
  judgementCriteria: z.array(z.string()).optional(),
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

// New regeneration schemas
export const OverviewSchema = z.object({ overview: z.string() });
export const LearningObjectivesSchema = z.object({ learningObjectives: z.array(z.string()) });
export const ActivationSchema = z.object({ activation: z.string() });
export const DemonstrationSchema = z.object({ demonstration: z.string() });
export const ApplicationSchema = z.object({ application: z.string() });
export const IntegrationSchema = z.object({ integration: z.string() });
export const ReflectionAndAssessmentSchema = z.object({ reflectionAndAssessment: z.string() });


// Schemas for detailed project part regeneration
export const DetailedDescriptionSchema = DetailedProjectDataSchema.pick({ detailedDescription: true });
export const TechStackSchema = DetailedProjectDataSchema.pick({ techStack: true });
export const LearningOutcomesSchema = DetailedProjectDataSchema.pick({ learningOutcomes: true });
export const ProjectRequirementsSchema = DetailedProjectDataSchema.pick({ projectRequirements: true });
export const DeliverablesSchema = DetailedProjectDataSchema.pick({ deliverables: true });
export const ConstraintsSchema = DetailedProjectDataSchema.pick({ constraints: true });
export const FutureOrientedElementSchema = DetailedProjectDataSchema.pick({ futureOrientedElement: true });
export const ParticipationModelSchema = DetailedProjectDataSchema.pick({ participationModel: true });
export const EvidenceOfLearningSchema = DetailedProjectDataSchema.pick({ evidenceOfLearning: true });
export const AssessmentFeedbackSchema = DetailedProjectDataSchema.pick({ assessmentFeedback: true });
export const JudgementCriteriaSchema = DetailedProjectDataSchema.pick({ judgementCriteria: true });


// For varied lesson generation
export const VariedCurriculumOutlineSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    lessons: z.array(z.string()),
});

export const PromptSuggestionSchema = z.object({
  summary: z.string(),
  suggestion: z.string(),
});

// Andragogical Analysis Schema
export const AndragogicalAnalysisSchema = z.object({
  poLD: z.object({
    authentic: z.string(),
    alignment: z.string(),
    holistic: z.string(),
    feedback: z.string(),
    judgement: z.string(),
    future: z.string(),
  }),
  boud: z.object({
    situated: z.string(),
    mediated: z.string(),
    relational: z.string(),
  }),
  billett: z.object({
    affordances: z.string(),
    guidance: z.string(),
  }),
  merrill: z.object({
    problem: z.string(),
    activation: z.string(),
    demonstration: z.string(),
    application: z.string(),
    integration: z.string(),
  }),
  bloom: z.object({
    progression: z.string(),
  }),
  vygotsky: z.object({
    zpd: z.string(),
    scaffolding: z.string(),
    social: z.string(),
    mko: z.string(),
  })
});
