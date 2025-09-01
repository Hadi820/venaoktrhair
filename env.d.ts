interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  // Add other VITE_ prefixed env vars used in the project if needed.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
