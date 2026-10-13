import { PORTFOLIO_KNOWLEDGE, Project } from '../../src/knowledge';
import { PortfolioIntent } from './intent-detector';

export interface SelectedKnowledgeResult {
  intent: PortfolioIntent;
  data: any;
  narrowedProject?: Project;
}

/**
 * Selects relevant portfolio knowledge from the shared PORTFOLIO_KNOWLEDGE layer
 * based on the detected intent and optional matched project title.
 */
export function selectKnowledge(
  intent: PortfolioIntent,
  matchedProjectTitle?: string
): SelectedKnowledgeResult {
  switch (intent) {
    case 'projects': {
      if (matchedProjectTitle) {
        const found = PORTFOLIO_KNOWLEDGE.projects.find(
          (p) => p.title.toLowerCase() === matchedProjectTitle.toLowerCase()
        );
        if (found) {
          return {
            intent: 'projects',
            data: [found],
            narrowedProject: found
          };
        }
      }
      return {
        intent: 'projects',
        data: PORTFOLIO_KNOWLEDGE.projects
      };
    }

    case 'skills':
      return {
        intent: 'skills',
        data: PORTFOLIO_KNOWLEDGE.skills
      };

    case 'about':
      return {
        intent: 'about',
        data: PORTFOLIO_KNOWLEDGE.about
      };

    case 'contact':
      return {
        intent: 'contact',
        data: PORTFOLIO_KNOWLEDGE.contact
      };

    case 'home':
      return {
        intent: 'home',
        data: PORTFOLIO_KNOWLEDGE.home
      };

    case 'unknown':
    default:
      // For unknown / general queries, pass full PORTFOLIO_KNOWLEDGE so the LLM
      // has all information available to answer natural questions about Bassant,
      // handle casual greetings, or refuse out-of-scope topics.
      return {
        intent: 'unknown',
        data: PORTFOLIO_KNOWLEDGE
      };
  }
}
