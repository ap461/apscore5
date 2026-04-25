import {
  createClient as baseCreateClient,
  type ClientConfig,
  type Route,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "./slicemachine.config.json";

/**
 * The project's Prismic repository name.
 * Prefer the env var so it can be overridden per environment.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * Route resolver — tells Prismic how to resolve document URLs.
 * Add entries here as you add new document types.
 */
const routes: Route[] = [
  { type: "homepage", path: "/" },
  { type: "courses_hub_page", path: "/course" },
  { type: "course_pillar_page", path: "/course/:uid" },
];

/**
 * Creates a Prismic client for the project's repository.
 * fetchOptions can be overridden per-call for ISR revalidation control.
 */
export const createClient = (config: ClientConfig = {}) => {
  const client = baseCreateClient(repositoryName, {
    routes,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 }, cache: "no-store" },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
