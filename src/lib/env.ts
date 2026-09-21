// Environment variable validation
// This ensures required environment variables are set at startup

const requiredEnvVars: string[] = [];

const optionalEnvVars: string[] = [];

function validateEnv(): void {
  const missing: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate NODE_ENV if set
  const validNodeEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validNodeEnvs.includes(process.env.NODE_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${process.env.NODE_ENV}. Must be one of: ${validNodeEnvs.join(', ')}`);
  }
}

// Export validation function for manual calls if needed
export { validateEnv };
