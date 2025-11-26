Elice - Design & Programming Style Guide
1. Core Philosophy
Our mission is to build a product that is clean, intuitive, consistent, and performant. Every line of code and design choice must reflect these core principles. This guide is the single source of truth for our design system, architecture, and coding standards. Adherence is not optional; it is essential for maintaining a high-quality, scalable, and maintainable application.

2. Design System
Our design system is built on a foundation of consistency and clarity. Before creating a new design pattern, always check if an existing one can be used or adapted.

2.1. Color Palette
Colors are managed via Tailwind CSS configuration. Use the defined names (primary, slate-500, etc.) instead of hex codes.

**Primary (Purple):** `primary` (#6700e6), `primary-dark` (#4a00a3), `primary-focus` (#8137ff), `primary-light`, `primary-lighter`, `primary-lightest`, `primary-medium` - Use for branding, buttons, active states, focus rings, and interactive elements.

**Neutral (Slate):** `slate-50` (main background), `slate-100` (subtle backgrounds), `slate-200` (borders), `slate-300` (input borders), `slate-400` (placeholder text), `slate-500` (secondary text), `slate-600` (body text), `slate-700` (sub-headings), `slate-800` (main headings).

**Semantic:** `green` (success, Beginner tags), `sky` (info, Intermediate tags), `red` (errors, delete actions).

2.2. Typography & Layout
**Font:** 'Pretendard', sans-serif • **Hierarchy:** h1 (text-3xl font-semibold) for page titles, h2 (text-2xl font-bold) for sections, h3 (text-xl font-bold) for sub-sections, text-sm for body • **Weights:** font-normal (default), font-medium, font-semibold, font-bold • **Markdown:** Use `<MarkdownContent />` for all user-generated content.

**Layout:** Base unit 1rem = 16px, spacing in 0.25rem increments • **Container:** `container mx-auto` with `px-4 sm:px-6 lg:px-8` • **Gaps:** gap-4, gap-6, gap-8 for grid/flex items • **Padding:** p-6 standard for cards and containers.

2.3. Borders, Shadows & Iconography
**Border Radius:** rounded-lg (0.5rem) standard for cards/inputs, rounded-full for tags/avatars • **Borders:** border border-slate-200 for containers, border-slate-300 for inputs • **Shadows:** shadow-sm (cards), shadow-lg (active/hovered cards), shadow-2xl (modals).

**Icons:** All from `src/components/icons/` • Standard size w-5 h-5 (w-6 h-6 for larger contexts) • strokeWidth="2" default • Always use with `<Tooltip />` when in `<IconButton />`.

2.4. Animation & Transitions
Motion should be purposeful, providing feedback and guiding the user without being distracting. - Standard Duration: 0.4s for all major UI animations. - Timing Function: ease-out is the standard. - Keyframe Animations (from index.html): - animate-fadeIn: For elements appearing in place. - animate-slideInFromRight / animate-slideInFromLeft: For elements entering from the side. - animate-fadeOut, animate-slideOutToRight, animate-slideOutToLeft: For elements being removed. - Transitions: Use transition-colors for hover and focus states on buttons and interactive elements.

3. Component Library (src/components/ui)
Always use or extend these components before creating new ones.

Button:
Variants: primary (solid purple), secondary (white with border), text (purple link-style).
Structure: rounded-lg, py-3 px-4, text-sm, font-bold. Always include an icon (<Icon className="w-5 h-5 mr-2" />) when appropriate.
State: Clear :hover (e.g., hover:bg-primary-dark), focus, and disabled (disabled:bg-slate-400) styles.
IconButton: For actions represented only by an icon. Must be wrapped in a <Tooltip />.
CardWrapper: The base for all card-like containers. Handles active state styling.
Input, Select, Textarea, Checkbox: The only components to be used for form fields to ensure consistent styling and focus states.
Collapsible: For hiding/showing sections of content (e.g., 'Advanced Settings').
Popover: For small overlays triggered by a button, like the 'Save to Library' notes input.
ConfirmationModal: For critical, blocking actions like deleting content or canceling generation.
Tag: For displaying keywords, categories, or difficulty levels.
4. Programming Principles & Architecture
4.1. Core Principles
Domain-Driven Design: Separate business logic from React
Service Layer: Abstract API calls into domain services
Unified State Management: Single source of truth using Zustand
Co-location: Types, components, hooks, and services live together in features
Dependency Injection: Services injected for testability
Clear Boundaries: UI layer → Hooks → Services → API → Domain
4.2. Golden Rule #1: File Size Guidelines (Target: 100 Lines)
Target: Keep files under 100 lines to enforce the Single Responsibility Principle, improve readability, and encourage modularity. This is a guideline, not a strict limit.

Target Ranges:

Components (.tsx): Aim for under 100 lines, but complex components can extend to ~150 lines if they maintain single responsibility.
Hooks (.ts): Aim for under 150 lines. Complex orchestration hooks may extend to ~200 lines if they remain cohesive.
Services (.ts): Aim for under 200 lines. Services may be longer if they comprehensively handle a single domain.
Configuration Files: Documentation-heavy config files (e.g., devops.config.ts) may exceed limits due to extensive inline documentation.
When to Refactor:

Extract Logic to Hooks: If a component file exceeds 100 lines, extract state management, side effects, API calls, or complex logic into custom hooks. Components should be "dumb" and receive data and functions as props.
Decompose Components: If a component's JSX is long, break it down into smaller, focused child components. A .tsx file over 80 lines is a prime candidate for refactoring.
Create Utilities: Pure, reusable functions (e.g., formatDate, fuzzySearch) belong in src/utils/.
Split Large Services: If a service exceeds 250 lines, consider splitting by subdomain or functionality.
Exceptions:

Configuration files with extensive documentation (e.g., devops.config.ts) are exempt due to inline documentation needs.
Comprehensive type definitions files may exceed limits if they define a complete domain model.
Single-purpose files that legitimately require more lines (e.g., complex validation, comprehensive schemas) are acceptable if they maintain single responsibility.
Principle Over Dogma: The goal is single responsibility and maintainability, not rigid line counting. If a file is well-organized, cohesive, and serves a single purpose, it may exceed these targets. However, files over 200 lines should be carefully reviewed for refactoring opportunities.

4.3. Golden Rule #2: DRY & SOLID Principles
DRY (Don't Repeat Yourself): If you find yourself copying and pasting code, stop and abstract it. UI is abstracted into components; logic is abstracted into hooks or utils.
SOLID Principles:
S (Single Responsibility): Encouraged by the file size guidelines. A component renders UI. A hook manages logic. An API function makes a network request. Nothing does more than one job.
O (Open/Closed): Components should be extensible via props without modifying their internal code. Use props like variant, className, and render props.
L (Liskov Substitution): Not as common in React, but ensure that if you create a component variant, it can be used everywhere the base component can.
I (Interface Segregation): Keep component props minimal. Don't pass down entire objects if a component only needs one or two properties.
D (Dependency Inversion): Components must not fetch their own data. They should depend on abstractions: props passed from a parent, data from Zustand stores via hooks, or services injected through hooks. This makes them reusable and testable.
4.4. Folder Structure
src/core: Core infrastructure and framework-agnostic utilities.
core/api: Centralized API client configuration.
core/errors: Error handling classes and types.
core/utils: Core utility functions (e.g., JSON parsing).
src/services: Service layer that encapsulates business logic and orchestrates API calls. Services are framework-agnostic and testable independently.
src/store: Global application state using Zustand stores. Each store manages a specific domain (navigation, curriculum, toast, etc.).
src/api: API communication with the Gemini API. Contains prompts, schemas, and API function implementations.
src/components: Reusable React components. ui/ contains generic, app-wide components.
src/config: Application configuration designed for ease of customization at deployment stage. This folder contains configuration files that should be easily modifiable without touching core application logic. devops.config.ts is for environment variables and model names. All deployment-specific settings, feature flags, and environment-dependent configurations belong here.
src/features: Self-contained feature modules (e.g., discovery, generation, library). Each feature contains its own components, hooks, and types.
src/hooks: Custom React hooks containing application logic that connects UI to stores and services.
src/layouts: Components defining the overall page structure (Header, Footer).
src/types: All shared TypeScript type and interface definitions.
src/utils: Pure, reusable helper functions.
4.5. State Management Playbook
Follow this hierarchy for state management:

useState: Default choice. Use for state that is local to a single component and its direct children.
Zustand Stores: Use for global application state that needs to be shared across multiple, non-adjacent components. Each store manages a specific domain (e.g., useCurriculumStore, useNavigationStore, useToastStore).
Store Location: All stores live in src/store/ and are exported from src/store/index.ts.
Usage Pattern: Use selectors to subscribe to specific state slices: useCurriculumStore((state) => state.selectedCurriculum).
Benefits: Avoids provider nesting, enables selective re-renders, and simplifies testing.
useLocalStorage Hook: Use for state that must persist across browser sessions (e.g., user settings, cached API responses). Note: Zustand stores can also use persistence middleware when needed.
4.6. API Layer & Service Layer
The application uses a layered architecture for API communication:

Service Layer (src/services)
Purpose: Encapsulates business logic and orchestrates API calls. Services are framework-agnostic and testable.
Pattern: Services are implemented as classes with singleton instances exported (e.g., curriculumService).
Responsibilities:
Transform business operations into API calls
Handle data transformation and validation
Manage complex business workflows
Error transformation and handling
Usage: Components and hooks should use services, not call API functions directly.
API Layer (src/api)
One File Per Action: Each API function resides in its own file in src/api/.
Single Client: All calls must use the shared ai client from src/core/api/client.ts.
Schemas: All generateContent calls that expect JSON must use a responseSchema defined in src/api/schema/.
Prompts: All prompt templates are organized in src/api/prompts/.
Parsing: Always wrap the AI's text response with cleanAndParseJson from src/core/utils/jsonUtils.ts to gracefully handle malformed JSON.
Error Handling: API functions and services should use try...catch blocks. Use ApiError from src/core/errors/AppError.ts for consistent error handling. The calling hook is responsible for showing user-facing error messages via useToast.
4.7. Architecture Layers
The application follows a clear layered architecture with defined responsibilities:

UI Layer (Components): React components that render UI and handle user interactions.
Hooks Layer: Custom hooks that connect UI to stores and services. Hooks orchestrate business logic and manage component-level state.
Service Layer: Business logic and API orchestration. Services are framework-agnostic and can be tested independently.
Store Layer (Zustand): Global application state management. Stores handle state synchronization and persistence.
API Layer: Direct communication with external APIs (Gemini). Contains prompts, schemas, and raw API calls.
Core Layer: Infrastructure utilities, error handling, and shared configurations.
Data Flow: Components → Hooks → Services → API → Domain

State Flow: Components → Hooks → Stores ← Services (services update stores after operations)

4.8. Accessibility (A11y)
Semantic HTML: Use <button>, <nav>, <main>, etc., correctly. Do not build buttons from <div>s.
ARIA Attributes: Add aria-label, aria-expanded, etc., where necessary to provide context for screen readers.
Keyboard Navigation: All interactive elements must be focusable and operable via the keyboard. Test your changes by using the Tab key.
Focus Management: Ensure focus is managed correctly when modals and popovers appear.
4.9. TypeScript Best Practices
TypeScript is integral to our codebase, and type safety is non-negotiable. All code must leverage TypeScript's type system to catch errors at compile-time.

**Never use `any`** - The use of `any` type is strictly prohibited. Using `any` defeats the purpose of TypeScript. Use these alternatives:
• `unknown` with type narrowing for external data
• Generic types `<T>` for flexible typed functions
• Union types (`'loading' | 'success' | 'error'`) for specific values
• Proper interfaces/types for objects
• `Record<string, T>` for dynamic keys with known value types
• Type assertions (`as`) only after runtime checks with type guards

Example - Using `unknown` with type narrowing:
```typescript
function parseResponse(data: unknown): ApiResponse {
  if (typeof data === 'object' && data !== null && 'status' in data) {
    return data as ApiResponse;
  }
  throw new Error('Invalid response format');
}
```

**Other TypeScript Rules:**
• Explicit types for complex function returns when not obvious
• Type guards to narrow types: `function isString(value: unknown): value is string { return typeof value === 'string'; }`
• Leverage utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Required<T>`
• Strict null checks with optional chaining (`?.`) and nullish coalescing (`??`)
• `"strict": true` and `"noImplicitAny": true` must be enabled in tsconfig.json
• All TypeScript errors must be resolved before committing code

4.10. Zod for Runtime Validation & Type Safety
Zod bridges static TypeScript types and runtime data validation, ensuring external data (API responses, user inputs, configuration) conforms to expected shapes.

**When to Use Zod:**
• API response validation (required)
• User input validation (forms, file uploads)
• External data sources (JSON files, env vars, localStorage)
• AI-generated content validation
• Configuration files at runtime

**Do NOT use for:** Internal function parameters where TypeScript types suffice, simple component props, already-validated data.

**Core Pattern - Schema Definition & Type Inference:**
```typescript
// Define schema
export const lessonSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  tags: z.array(z.string()),
  isPublished: z.boolean().default(false),
});

// Infer TypeScript type from schema
export type Lesson = z.infer<typeof lessonSchema>;

// For partial updates
export const lessonUpdateSchema = lessonSchema.partial();
```

**API Response Validation (Mandatory Pattern):**
```typescript
import { ai } from '@/core/api/client';
import { curriculumSchema } from '@/api/schema';
import { cleanAndParseJson } from '@/core/utils/jsonUtils';
import { ApiError } from '@/core/errors/AppError';

export async function generateCurriculum(prompt: string): Promise<Curriculum> {
  try {
    const response = await ai.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseSchema: curriculumSchema, // Zod schema passed directly
      },
    });

    const text = response.response.text();
    const rawData = cleanAndParseJson(text);
    
    // Runtime validation with Zod
    const validatedData = curriculumSchema.parse(rawData);
    return validatedData;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ApiError(`Invalid curriculum data: ${errorMessages}`, error);
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to generate curriculum',
      error instanceof Error ? error : undefined
    );
  }
}
```

**Form Validation with React Hook Form:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const lessonFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  duration: z.number().int().positive().max(480),
  tags: z.array(z.string()).min(1).max(10),
});

type LessonFormData = z.infer<typeof lessonFormSchema>;

export function LessonForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
  });

  const onSubmit = (data: LessonFormData) => {
    // Data is guaranteed valid
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

**Environment Variable Validation:**
```typescript
const envSchema = z.object({
  VITE_GEMINI_API_KEY: z.string().min(1),
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
});

export const env = envSchema.parse({
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
});
```

**Safe Parsing vs Throwing:**
```typescript
// .parse() - Throws on error (use for critical paths)
const validData = schema.parse(untrustedData);

// .safeParse() - Returns result object (use for graceful error handling)
const result = schema.safeParse(untrustedData);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.errors);
}
```

**Common Patterns:**
```typescript
// Nested objects & arrays
const curriculumSchema = z.object({
  lessons: z.array(lessonSchema).min(1).max(50),
  metadata: z.object({
    author: z.string(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
  }),
});

// Optional with defaults
const configSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  maxItems: z.number().int().positive().default(10),
});

// Transformations
const userSchema = z.object({
  email: z.string().email().toLowerCase(),
  age: z.string().transform((val) => parseInt(val, 10)),
});

// Custom validation
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

**Schema Organization:**
```typescript
// src/api/schema/lessonSchema.ts
export const lessonSchema = z.object({...});
export const lessonCreateSchema = lessonSchema.omit({ id: true });
export const lessonUpdateSchema = lessonSchema.partial();
export const lessonListSchema = z.array(lessonSchema);

export type Lesson = z.infer<typeof lessonSchema>;
export type LessonCreate = z.infer<typeof lessonCreateSchema>;
```

**Key Principles:**
• Schema-first approach: Define Zod schema, infer TypeScript type
• Validate at boundaries: API responses, user inputs, external data
• Reuse schemas: Create shared schemas for common patterns
• Provide clear error messages: Use custom messages in validation rules
• Never use `any` or `unknown()` in schemas - be specific
• Always handle `ZodError` with context in error messages

4.11. Mandatory Refactoring After Changes
Rule: After making any change to the codebase, you MUST refactor all affected files to ensure they fully comply with every guideline in this style guide.

**Affected Files Scope:** Files you directly edit, files that import your changes, related files in same feature/module.

**Refactoring Requirements:** Document work in ai-work/ folder (section 5), eliminate all `any` types (4.9), ensure file size compliance (4.2), verify architecture alignment (4.7), replace custom components with library components (section 3), update styles to design system tokens (section 2), maintain consistency across related files, follow state management playbook (4.5), adhere to DRY and SOLID principles (4.3), ensure accessibility compliance (4.8).

**Result:** Every change must leave the codebase more compliant with this guide than before.

4.12. Code Templates & Patterns

**Component Structure:**
• Imports: External deps → Core/types → Services → Stores → UI components → Hooks → Local
• Interface with destructured props (avoid passing entire objects)
• Local state with `useState` only
• Custom hooks for logic/API calls
• Event handlers
• Return JSX with Tailwind classes

**Hook Structure:**
• Return object: `{ data, isLoading, error, refetch }` or similar
• Use services for API calls, update stores
• Handle errors with try/catch, throw ApiError
• Side effects in useEffect

**Service Structure:**
• Class with singleton export (`export const serviceName = new ServiceName()`)
• Public methods for domain operations
• Private methods for data transformations
• Throw ApiError on failures
• Framework-agnostic (no React dependencies)

**API Function Structure:**
• One file per action in `src/api/`
• Use shared `ai` client from `src/core/api/client.ts`
• Use responseSchema with Zod for structured output
• Parse with `cleanAndParseJson` from `src/core/utils/jsonUtils.ts`
• Validate with Zod `.parse()`

**Example Component Template:**
```typescript
// src/features/[feature]/components/ComponentName.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IconName } from '@/components/icons';
import { useFeatureHook } from '../hooks/useFeatureHook';

interface ComponentNameProps {
  title: string;
  onAction: () => void;
  className?: string;
}

export function ComponentName({ title, onAction, className }: ComponentNameProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useFeatureHook();

  const handleClick = () => {
    onAction();
    setIsOpen(true);
  };

  return (
    <div className={cn('rounded-lg border border-slate-200 p-6', className)}>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <Button variant="primary" onClick={handleClick}>
        <IconName className="w-5 h-5 mr-2" />
        Action
      </Button>
    </div>
  );
}
```

4.13. Naming Conventions
Follow these naming patterns consistently:

**Components:** PascalCase (UserProfile.tsx, LessonEditor.tsx)
**Hooks:** camelCase starting with "use" (useLessonPlan.ts, useProjectApi.ts)
**Services:** PascalCase ending with "Service" (CurriculumService.ts) - exported instance is camelCase (curriculumService)
**Types/Interfaces:** PascalCase (LessonPlan, ApiResponse, UserData)
**Functions:** camelCase (formatDate, parseResponse, validateInput)
**Constants:** UPPER_SNAKE_CASE (MAX_FILE_SIZE, API_TIMEOUT)
**Files:** Match the exported name (component UserProfile → UserProfile.tsx, hook useProjectApi → useProjectApi.ts)
**Feature Folders:** kebab-case (content-library, lesson-editor)

4.14. Quick Reference

**State Management Decision:**
• Local to one component → `useState`
• Shared across multiple components → Zustand Store (section 4.5)
• Persist across sessions → `useLocalStorage` or Zustand with persistence
• Server state (API data) → Service → Store pattern, handle loading/error in hook

**Component Creation Decision:**
• Exists in `src/components/ui/` → Use or extend it
• Feature-specific (one feature only) → `src/features/[feature]/components/`
• Reusable across features → `src/components/`

**File Size Refactoring:**
• Component >100 lines → Extract logic to hook, decompose into smaller components
• Hook >150 lines → Split into multiple focused hooks
• Service >200 lines → Split by subdomain or functionality
• Always maintain single responsibility

**Import Order:**
1. External dependencies (React, third-party libraries)
2. Internal core utilities and types
3. Services
4. Stores
5. Components (UI library first, then feature components)
6. Hooks
7. Types (if not already imported)
8. Utilities (feature-specific)
9. Relative imports (last)

**Never Do:**
• Use `any` type (use `unknown`, generics, union types, or proper interfaces)
• Component fetching data directly (use hooks → services)
• Pass entire objects as props (destructure: `name={user.name}`)
• Direct API calls from components (use services)
• Create duplicate UI components (use `src/components/ui`)
• Use hex codes directly (use Tailwind color names: `bg-primary`)
• Large monolithic components (extract hooks and sub-components)
• Magic strings/numbers (use constants or enums)
• Inline styles (use Tailwind classes)
• Direct DOM manipulation (use React patterns)

4.15. Supabase Backend Integration

**Architecture Flow:** Components → Hooks → Services → Supabase Client → Backend (stores updated by services)

**Client Setup:**
```typescript
// src/core/api/supabase.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true }
});
```

**Service Pattern (with snake_case ↔ camelCase transformation):**
```typescript
// src/services/ContentLibraryService.ts
import { supabase } from '@/core/api/supabase';
import { ApiError } from '@/core/errors/AppError';

const toCamelCase = (row: DbRow): ContentItem => ({
  id: row.id,
  userId: row.user_id,
  lessonCount: row.lesson_count,
});

class ContentLibraryService {
  async getAll(): Promise<ContentItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw new ApiError(error.message, error);
    return data.map(toCamelCase);
  }

  async create(item: Omit<ContentItem, 'id'>): Promise<ContentItem> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new ApiError('Not authenticated');

    const { data, error } = await supabase
      .from('content_items')
      .insert({ ...toSnakeCase(item), user_id: user.id })
      .select()
      .single();

    if (error) throw new ApiError(error.message, error);
    return toCamelCase(data);
  }
}

export const contentLibraryService = new ContentLibraryService();
```

**Key Principles:**
• Always use service layer (never call Supabase directly from components)
• Transform snake_case (database) to camelCase (TypeScript) in services
• Handle errors with ApiError
• Validate with Zod schemas
• Use Row Level Security (RLS) policies for data access control

**Database Setup:** Create project at supabase.com, run SQL for tables/policies, add credentials to .env (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

6. Git & Contribution Guide
6.1. Branching
All work must be done in a feature branch.
Branch names should be descriptive: feature/add-user-profile, fix/login-bug.
6.2. Commit Messages
Follow the Conventional Commits specification. This is critical for automated versioning and changelogs.

feat:: A new feature.
fix:: A bug fix.
chore:: Changes to the build process or auxiliary tools.
docs:: Documentation only changes.
style:: Changes that do not affect the meaning of the code (white-space, formatting).
refactor:: A code change that neither fixes a bug nor adds a feature.
perf:: A code change that improves performance.
Example: feat: Add user profile modal with editing capabilities

6.3. Pull Requests (PRs)
A PR should be small and focused on a single feature or fix.
The PR description should clearly explain what was done and why.
All PRs require at least one approval from a team member before merging.
Ensure all automated checks (linting, tests) pass.
