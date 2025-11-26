import { PERFORMANCE, FEATURE_FLAGS, UI_SETTINGS, STORAGE_KEYS, PROJECT_GENERATION } from './devops.config';

/**
 * =============================================================================
 * APPLICATION CONFIGURATION
 * =============================================================================
 * This file centralizes application-wide configurations for easy customization.
 * It combines DevOps-managed settings from `devops.config.ts` with UI-specific settings.
 *
 * Developers should use this `appConfig` object to access any configuration.
 * DevOps team should only modify `devops.config.ts`.
 */
export const appConfig = {
  /**
   * DevOps-managed cache durations. Modify in `devops.config.ts`.
   */
  CACHE_DURATIONS: PERFORMANCE.CACHE_DURATIONS,

  /**
   * DevOps-managed durations for simulated progress bars. Modify in `devops.config.ts`.
   */
  SIMULATED_PROGRESS_DURATIONS: PERFORMANCE.SIMULATED_PROGRESS_DURATIONS,

  /**
   * DevOps-managed general UI settings. Modify in `devops.config.ts`.
   */
  UI_SETTINGS: UI_SETTINGS,
  
  /**
   * DevOps-managed feature flags. Modify in `devops.config.ts`.
   */
  FEATURE_FLAGS: FEATURE_FLAGS,

  /**
   * DevOps-managed storage keys. Modify in `devops.config.ts`.
   */
  STORAGE_KEYS: STORAGE_KEYS,
  
  /**
   * DevOps-managed project generation settings. Modify in `devops.config.ts`.
   */
  PROJECT_GENERATION: PROJECT_GENERATION,
};