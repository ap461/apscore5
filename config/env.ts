/**
 * Validated environment variables.
 * Never use process.env directly in components — always import from here.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Make sure it is set in .env.local (development) or your deployment environment.`
    );
  }
  return value;
}

function optionalEnv(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  /** Prismic repository name — required */
  PRISMIC_REPOSITORY_NAME: requireEnv("NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME"),

  /** Canonical site URL — required (e.g. https://apscore5.com) */
  SITE_URL: requireEnv("NEXT_PUBLIC_SITE_URL"),

  /** Google Analytics measurement ID — optional */
  GA_ID: optionalEnv("NEXT_PUBLIC_GA_ID"),

  /** Prismic access token — optional (only needed for private repos) */
  PRISMIC_ACCESS_TOKEN: optionalEnv("PRISMIC_ACCESS_TOKEN"),

  /** Node environment */
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;

export type Env = typeof env;
