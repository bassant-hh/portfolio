import { PROJECTS_DATA } from '../../src/knowledge';

export type PortfolioIntent =
  | 'home'
  | 'about'
  | 'projects'
  | 'skills'
  | 'contact'
  | 'unknown';

export interface IntentResult {
  intent: PortfolioIntent;
  matchedProjectTitle?: string;
}

/**
 * Normalizes input text by converting to lowercase and stripping punctuation.
 * Preserves non-ASCII characters (like Arabic).
 */
function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if normalized query contains any of the given keywords or phrases.
 */
function containsKeyword(normalizedQuery: string, keywords: string[]): boolean {
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return false;
    return normalizedQuery.includes(normalizedKeyword);
  });
}

/**
 * Checks if question mentions a specific project title from PROJECTS_DATA.
 */
function findMatchingProjectTitle(rawQuestion: string): string | undefined {
  const normQuestion = normalizeText(rawQuestion);

  for (const project of PROJECTS_DATA) {
    const normTitle = normalizeText(project.title);
    if (normTitle && normQuestion.includes(normTitle)) {
      return project.title;
    }
  }

  return undefined;
}

/**
 * Detects the intent of a user question using keyword and project title matching.
 * Serves as a helper for knowledge selection routing, not a strict access gate.
 */
export function detectIntent(question: string): IntentResult {
  const normalized = normalizeText(question);

  if (!normalized) {
    return { intent: 'unknown' };
  }

  // 1. Projects Intent Check (specific project title first)
  const matchedProjectTitle = findMatchingProjectTitle(question);
  if (matchedProjectTitle) {
    return { intent: 'projects', matchedProjectTitle };
  }

  // 2. Contact Intent Check
  const contactKeywords = [
    'email', 'contact', 'github', 'linkedin', 'reach', 'hire', 'hiring',
    'تواصل', 'ايميل', 'إيميل', 'لينكد', 'جيت هاب', 'موقع'
  ];
  if (containsKeyword(normalized, contactKeywords)) {
    return { intent: 'contact' };
  }

  // 3. Projects Intent Check (general)
  const projectKeywords = [
    'projects', 'project', 'portfolio', 'built', 'developed', 'applications', 'apps', 'websites',
    'مشروع', 'مشاريع', 'تطبيق', 'موقع', 'مواقع', 'اعمال'
  ];
  if (containsKeyword(normalized, projectKeywords)) {
    return { intent: 'projects' };
  }

  // 4. Skills Intent Check
  const skillsKeywords = [
    'skills', 'technologies', 'tech stack', 'stack', 'frameworks', 'languages', 'tools',
    'مهارات', 'تكنولوجيز', 'تقنيات', 'لغات', 'ادوات', 'أدوات', 'فريمورك'
  ];
  if (containsKeyword(normalized, skillsKeywords)) {
    return { intent: 'skills' };
  }

  // 5. About Intent Check
  const aboutKeywords = [
    'about', 'background', 'experience', 'education', 'degree', 'studied', 'training', 'iti',
    'عن', 'خبرة', 'خبرتها', 'تعليم', 'دراسة', 'دراستها', 'ايتي'
  ];
  if (containsKeyword(normalized, aboutKeywords)) {
    return { intent: 'about' };
  }

  // 6. Home Intent Check
  const homeKeywords = [
    'name', 'role', 'who is bassant', 'what does bassant do', 'introduction', 'developer',
    'من هي', 'مين', 'بتعمل ايه', 'دورها', 'مطور', 'مطورة'
  ];
  if (containsKeyword(normalized, homeKeywords)) {
    return { intent: 'home' };
  }

  // 7. Unknown Fallback
  return { intent: 'unknown' };
}
