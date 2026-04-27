// migrate-courses-hub.js
// Uploads the /courses hub page to Prismic via the Migration API.
// Run with: node migrate-courses-hub.js

require('dotenv').config();
const { createWriteClient, createMigration } = require('@prismicio/client');

// ---- Build the document -----------------------------------------
const migration = createMigration();

const coursesHubDoc = {
  type: 'courses_hub_page',
  uid: 'courses',
  lang: 'en-us',
  tags: [],
  data: {
    // Document-level SEO fields
    meta_title: 'All AP Courses — Complete Guides & Free Practice | APScore5',
    meta_description:
      'Every AP course on APScore5. Unit breakdowns, free practice, and a 5-minute daily path to a 5. Pick your AP and start.',
    canonical_url: {
      link_type: 'Web',
      url: 'https://apscore5.com/courses',
    },
    no_index: false,

    slices: [
      // 1) COURSES_HUB_HERO
      {
        slice_type: 'courses_hub_hero',
        slice_label: null,
        variation: 'default',
        version: 'initial',
        primary: {
          eyebrow: 'All AP courses',
          headline: [
            {
              type: 'heading1',
              text: 'Eight courses. One five.',
              spans: [{ start: 18, end: 22, type: 'em' }], // "five"
            },
          ],
          subheadline: [
            {
              type: 'paragraph',
              text:
                'Pick your AP. Every course comes with full unit coverage, a question bank aligned to the College Board framework, and a dashboard that tells you exactly where you stand.',
              spans: [],
            },
          ],
          primary_cta_text: 'Browse all courses →',
          primary_cta_link: { link_type: 'Web', url: '#course-grid' },
          secondary_cta_text: 'Create free account',
          secondary_cta_link: { link_type: 'Web', url: '/signup' },
        },
        items: [
          { stat_number: '8', stat_label: 'AP courses', stat_caption: 'Live and coming soon' },
          { stat_number: '10,000+', stat_label: 'Practice questions', stat_caption: 'Across all courses' },
          { stat_number: '6,500+', stat_label: 'Flashcards', stat_caption: 'Spaced-repetition ready' },
          { stat_number: 'May 2026', stat_label: 'Exam window', stat_caption: 'Countdown on every page' },
        ],
      },

      // 2) COURSE_GRID
      {
        slice_type: 'course_grid',
        slice_label: null,
        variation: 'default',
        version: 'initial',
        primary: {
          eyebrow: 'The catalog',
          headline: [
            { type: 'heading2', text: 'Every AP course we support', spans: [] },
          ],
          lede: [
            {
              type: 'paragraph',
              text:
                'Three live courses with full unit coverage. Five more rolling out through the 2026 exam window. Click any card for the complete guide, free practice, and exam strategy.',
              spans: [],
            },
          ],
        },
        items: [
          {
            course_name: 'AP Human Geography',
            course_status: 'Live',
            accent_color: '#2F5CFF',
            summary: [
              {
                type: 'paragraph',
                text:
                  '7 units covering how geographers think, population, culture, politics, agriculture, cities, and development. 1,250+ free practice questions.',
                spans: [],
              },
            ],
            units_preview: 'Thinking Geographically · Population · Cultural Patterns',
            question_count: '1,250+',
            pillar_link: { link_type: 'Web', url: '/ap-human-geography' },
          },
          {
            course_name: 'AP Biology',
            course_status: 'Live',
            accent_color: '#E67E22',
            summary: [
              {
                type: 'paragraph',
                text:
                  '8 units from chemistry of life through ecology. Lab-heavy exam — we cover every required practical and the FRQ patterns that show up.',
                spans: [],
              },
            ],
            units_preview: 'Chemistry of Life · Cell Structure · Cellular Energetics',
            question_count: '1,400+',
            pillar_link: { link_type: 'Web', url: '/ap-biology' },
          },
          {
            course_name: 'AP Computer Science Principles',
            course_status: 'Live',
            accent_color: '#27AE60',
            summary: [
              {
                type: 'paragraph',
                text:
                  'Broad intro to CS concepts — no prerequisites. 5 big ideas, the Create performance task, and the 70-question MCQ exam.',
                spans: [],
              },
            ],
            units_preview: 'Creative Development · Data · Algorithms',
            question_count: '900+',
            pillar_link: { link_type: 'Web', url: '/ap-computer-science-principles' },
          },
          {
            course_name: 'AP Calculus AB',
            course_status: 'Coming Soon',
            accent_color: '#8E44AD',
            summary: [
              {
                type: 'paragraph',
                text:
                  'Limits, derivatives, integrals, and applications. Calculator and non-calculator sections, FRQs with specific rubric structure.',
                spans: [],
              },
            ],
            units_preview: 'Limits · Differentiation · Integration',
            question_count: 'Coming soon',
            pillar_link: { link_type: 'Web', url: '/ap-calculus-ab' },
          },
          {
            course_name: 'AP US History',
            course_status: 'Coming Soon',
            accent_color: '#C0392B',
            summary: [
              {
                type: 'paragraph',
                text:
                  '9 periods from 1491 to present. Includes the DBQ, LEQ, and SAQ — we break down every rubric point.',
                spans: [],
              },
            ],
            units_preview: 'Period 1 (1491–1607) · Period 2 · Period 3',
            question_count: 'Coming soon',
            pillar_link: { link_type: 'Web', url: '/ap-us-history' },
          },
        ],
      },

      // 3) WHY_AP_MATTERS
      {
        slice_type: 'why_ap_matters',
        slice_label: null,
        variation: 'default',
        version: 'initial',
        primary: {
          eyebrow: 'Why AP',
          headline: [
            { type: 'heading2', text: 'What AP actually buys you', spans: [] },
          ],
          body: [
            {
              type: 'paragraph',
              text:
                'AP courses are College Board–designed college-level classes offered in high school. A 4 or 5 on the May exam can earn college credit, place you out of intro classes, and sharpens a college application more than nearly any other signal.',
              spans: [],
            },
            {
              type: 'paragraph',
              text:
                'AP exams are scored 1–5. The national pass rate (3+) varies by subject from about 50% to 80%. Most selective colleges give credit only for 4s and 5s — which is why daily practice, not cramming, is the pattern that works.',
              spans: [],
            },
          ],
        },
        items: [],
      },

      // 4) AP_PLANNING_POLL
      {
        slice_type: 'ap_planning_poll',
        slice_label: null,
        variation: 'default',
        version: 'initial',
        primary: {
          eyebrow: 'Quick poll',
          question: 'How many AP courses are you planning this year?',
          caption: 'Anonymous. Results update live.',
        },
        items: [
          { option_label: '1 course', option_value: '1' },
          { option_label: '2 courses', option_value: '2' },
          { option_label: '3 courses', option_value: '3' },
          { option_label: '4+ courses', option_value: '4+' },
        ],
      },

      // 5) CONVERSION_BLOCK
      {
        slice_type: 'conversion_block',
        slice_label: null,
        variation: 'default',
        version: 'initial',
        primary: {
          eyebrow: 'Ready when you are',
          headline: [
            { type: 'heading2', text: 'Start free — track your progress', spans: [] },
          ],
          body: [
            {
              type: 'paragraph',
              text:
                'Create a free account to save practice, see weak areas across units, and get one trivia question in your inbox daily.',
              spans: [],
            },
          ],
          cta_text: 'Create a free account',
          cta_link: { link_type: 'Web', url: '/signup' },
          trust_line: 'Free forever · No credit card · 60-second signup',
        },
        items: [],
      },

      // 6) COURSES_FAQ
      {
        slice_type: 'courses_faq',
        slice_label: null,
        variation: 'default',
        version: 'initial',
        primary: {
          eyebrow: 'FAQ',
          headline: [
            { type: 'heading2', text: 'Common questions about AP', spans: [] },
          ],
        },
        items: [
          {
            question: 'How do I register for an AP exam?',
            answer: [
              {
                type: 'paragraph',
                text:
                  'Through your school\'s AP coordinator. Registration usually closes in early November for May exams. Homeschooled students can register through a nearby testing school.',
                spans: [],
              },
            ],
          },
          {
            question: 'Which AP courses are the hardest?',
            answer: [
              {
                type: 'paragraph',
                text:
                  'By pass rate, the toughest exams are Physics 1, US History, and English Literature. By content density, AP Biology and AP Chemistry. Difficulty is also subjective — pick courses aligned with what you are strong in.',
                spans: [],
              },
            ],
          },
          {
            question: 'Do colleges actually give credit for AP scores?',
            answer: [
              {
                type: 'paragraph',
                text:
                  'Most do, but policies vary. Selective schools (top 20) often require a 5, credit only a few subjects, or use scores for placement rather than credit. Check each school\'s AP credit policy before committing.',
                spans: [],
              },
            ],
          },
          {
            question: 'How many APs should I take?',
            answer: [
              {
                type: 'paragraph',
                text:
                  'Quality beats quantity. 3–5 APs across high school, with strong scores, outperforms 8 APs with mixed results. Load up in areas aligned with your intended major.',
                spans: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

migration.createDocument(coursesHubDoc, 'Courses Hub');

// ---- Push to Prismic --------------------------------------------
const client = createWriteClient(process.env.PRISMIC_REPO, {
  writeToken: process.env.PRISMIC_MIGRATION_TOKEN,
});

(async () => {
  try {
    await client.migrate(migration, {
      reporter: (event) => {
        if (event.type === 'start') console.log('▶ Migration started');
        if (event.type === 'end') console.log('✓ Migration complete');
        if (event.type === 'documents:creating')
          console.log(`  creating ${event.data.document.title}…`);
        if (event.type === 'documents:created')
          console.log(`  ✓ created: ${event.data.document.title}`);
      },
    });
    console.log('\nDone. Open Prismic → Documents → Courses Hub → Publish.');
  } catch (err) {
    console.error('\n✗ Migration failed:', err.message);
    if (err.url) console.error('   URL:', err.url);
    if (err.response) console.error('   Response:', JSON.stringify(err.response, null, 2));
    process.exit(1);
  }
})();