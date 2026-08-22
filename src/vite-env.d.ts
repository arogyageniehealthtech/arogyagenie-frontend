/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  // Add other custom env variables here if you create them in the future
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}