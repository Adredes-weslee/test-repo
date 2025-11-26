/**
 * =============================================================================
 * DEVOPS CONFIGURATION
 * =============================================================================
 * This file is the single source of truth for all configurations that the
 * DevOps team or administrators are likely to modify. It centralizes settings
 * for different environments, feature toggles, and performance tuning.
 *
 * PLEASE MAKE ANY ENVIRONMENT-SPECIFIC CHANGES HERE.
 */

// =============================================================================
// AI Model Selection
// =============================================================================
/**
 * Centralizes all AI model selections for different API calls.
 * To use a new model for a feature, simply change the string value here.
 */
export const API_MODELS = {
  // --- Discovery Feature ---
  /**
   * Model for fetching trending topics for courses.
   * A lightweight model is sufficient.
   */
  FETCH_TRENDING_TOPICS: 'gemini-flash-lite-latest',
  /**
   * Model for generating multiple curriculum outlines.
   * A balance of speed and quality is needed.
   */
  GENERATE_CURRICULUM: 'gemini-flash-lite-latest',

  // --- Generation Feature (User-selectable models) ---
  /**
   * High-quality model for generating detailed lesson plans.
   * Exposed as an option to the user in the UI.
   */
  GENERATION_PRO: 'gemini-2.5-pro',
  /**
   * Balanced model for generating lesson plans.
   * Exposed as an option to the user in the UI.
   */
  GENERATION_FLASH: 'gemini-flash-latest',
  /**
   * Fast, lightweight model for generating lesson plans.
   * Exposed as an option to the user in the UI.
   */
  GENERATION_FLASH_LITE: 'gemini-flash-lite-latest',
  
  // --- Capstone Assets Generation Feature ---
  /**
   * Model for fetching trending topics for capstone projects.
   * A lightweight model is sufficient.
   */
  FETCH_TRENDING_CAPSTONE_TOPICS: 'gemini-flash-lite-latest',
  /**
   * Model for generating multiple capstone project ideas.
   * A balance of speed and quality is needed.
   */
  GENERATE_CAPSTONE_PROJECTS: 'gemini-flash-lite-latest',
  /**
   * Model for generating detailed project specifications, including boilerplate code.
   * Requires a more powerful model for high-quality, complex output.
   */
  GENERATE_DETAILED_PROJECT: 'gemini-flash-lite-latest',
};

// =============================================================================
// Feature Flags
// =============================================================================
/**
 * Feature flags to enable or disable parts of the application.
 * Set a feature to `false` to disable it.
 */
export const FEATURE_FLAGS = {
  // Show or hide the file upload sections in Discovery and Capstone Assets.
  enableFileUpload: true,
  // Show or hide the "AI Agent Thoughts" in the RAG panel.
  showAgentThoughts: true,
};

// =============================================================================
// Performance, Caching & UX
// =============================================================================
/**
 * Configuration for application performance and caching.
 */
export const PERFORMANCE = {
  /**
   * Cache durations for API calls in milliseconds.
   * Example: 24 * 60 * 60 * 1000 is one day.
   */
  CACHE_DURATIONS: {
    trendingTopics: 24 * 60 * 60 * 1000, // 1 day
  },

  /**
   * Durations for simulated progress bars during API calls (in milliseconds).
   * This enhances the user experience by providing visual feedback.
   */
  SIMULATED_PROGRESS_DURATIONS: {
    discovery: 8000,
    generation: 6000,
    capstoneDiscovery: 8000,
    capstoneDetails: 12000,
  },
};

// =============================================================================
// UI/UX Settings
// =============================================================================
/**
 * General UI settings that can be tuned for different deployments.
 */
export const UI_SETTINGS = {
  // Default duration for toast notifications to be displayed (in milliseconds).
  toastDuration: 6000,
  // The number of trending topics to fetch and display in the Discovery feature.
  trendingTopicsCount: 6,
  // Whether collapsible sections (e.g., 'Advanced Settings') should be open by default.
  defaultCollapsibleState: false,
  
  // Configuration for the Trending Feature
  trendingFeature: {
    // Number of topics to fetch per page.
    topicsPerPage: 6,
    // Available time periods for filtering trends.
    timePeriods: ['4 Weeks', '3 Months', '6 Months', '1 Year', '2 Years'],
    // Default time period selected.
    defaultTimePeriod: '4 Weeks',
    // Colors used for the trend lines in charts.
    chartColors: [
        '#6700e6', // primary
        '#0ea5e9', // sky-500
        '#22c55e', // green-500
        '#f97316', // orange-500
        '#ef4444', // red-500
        '#8b5cf6', // violet-500
    ],
    // Configuration for generating trend data points based on time period.
    timePeriodConfig: {
        '1 Week': { points: 7, granularity: 'daily' },
        '4 Weeks': { points: 28, granularity: 'daily' },
        '3 Months': { points: 12, granularity: 'weekly' },
        '6 Months': { points: 26, granularity: 'weekly' },
        '1 Year': { points: 52, granularity: 'weekly' },
        '2 Years': { points: 24, granularity: 'monthly' },
        '3 Years': { points: 36, granularity: 'monthly' }
    },
  },
};

// =============================================================================
// Storage Keys
// =============================================================================
/**
 * Centralizes keys used for browser localStorage.
 */
export const STORAGE_KEYS = {
    activeCapstoneProject: 'eliceCreatorAIActiveCapstoneProject',
    discoveryCurriculumCache: 'eliceCreatorAIDiscoveryCache',
    discoveryProjectCache: 'eliceCreatorAIProjectCache',
    generationSettings: 'eliceCreatorAIGenerationSettings',
    trendingTrendsCache: 'eliceCreatorAITrendingTrendsCache',
    trendingTopicDetailsCache: 'eliceCreatorAITrendingTopicDetailsCache',
};

// =============================================================================
// Project Generation Settings
// =============================================================================
/**
 * Settings related to capstone project generation.
 */
export const PROJECT_GENERATION = {
    // File extensions to be treated as binary and skipped during content generation.
    binaryFileExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.mp4', '.mov', '.woff', '.woff2', '.ttf', '.eot', '.otf'],
};