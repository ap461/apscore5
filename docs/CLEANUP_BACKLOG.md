# Cleanup Backlog

Items deferred from focused PRs, to be addressed in a dedicated cleanup pass.

## Stale custom types and slices (post-topic-page cleanup PR)

- customtypes/topic_blog/ — appears to be a stale prototype that
  predates the canonical topic_page from the topic page plan.
  Has only UID field, no body, no slices. Referenced in
  prismicio-types.d.ts and app/sitemap.ts (line 28, wrapped in
  .catch(() => [])). Likely safe to delete after verifying no
  documents of this type exist in Prismic.

- slices/{ApPlanningPoll, ConversionBlock, CourseGrid,
  CoursesHubHero, WhyApMatters}/ — orphan slice folders, each
  with only index.tsx and no model.json. Not registered in
  slices/index.ts. Either wire them up or delete.
