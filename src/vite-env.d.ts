/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORCHESTRATOR_BASE_URL?: string;
  readonly VITE_USE_ORCHESTRATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
