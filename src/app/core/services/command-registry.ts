import { Injectable, inject } from '@angular/core';
import { CommandRegistryEntry } from '../../features/terminal/models/command-registry-entry.model';
import { ABOUT_DATA } from '../../features/about/data/about.data';
import { PROJECTS_DATA } from '../../features/projects/data/projects.data';
import { SKILLS_DATA } from '../../features/skills/data/skills.data';
import {
  formatTerminalOutput,
  formatTitle,
  formatLabelValue,
  formatSeparator
} from '../../features/terminal/helpers/terminal-formatter';

@Injectable({
  providedIn: 'root'
})
export class UnknownCommandStrategy {
  handle(command: string, args: string[]): string | string[] {
    return [
      formatTerminalOutput(`Command not found: "${command}"`, 'error'),
      `Type ${formatTerminalOutput('help', 'highlight')} to see all available commands.`
    ];
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommandRegistry {
  private readonly unknownCommandStrategy = inject(UnknownCommandStrategy);
  private readonly registry = new Map<string, CommandRegistryEntry>();

  constructor() {
    this.registerCommands();
  }

  getRegistry(): Map<string, CommandRegistryEntry> {
    return this.registry;
  }

  get(name: string): CommandRegistryEntry | undefined {
    return this.registry.get(name);
  }

  handleUnknown(command: string, args: string[]): string | string[] {
    return this.unknownCommandStrategy.handle(command, args);
  }

  private register(entry: CommandRegistryEntry): void {
    this.registry.set(entry.name, entry);
    entry.aliases.forEach(alias => this.registry.set(alias, entry));
  }

  private registerCommands(): void {
    // 1. HELP
    this.register({
      name: 'help',
      description: 'Display all available commands and summaries',
      aliases: ['--help', '-h'],
      usage: 'help',
      execute: () => {
        const output: string[] = [
          `[${formatTerminalOutput('AVAILABLE COMMANDS', 'highlight')}]`,
          ''
        ];
        const seen = new Set<string>();
        this.registry.forEach(entry => {
          if (!seen.has(entry.name)) {
            seen.add(entry.name);
            const dispName = entry.name === 'bassant' ? 'bassant .' : entry.name;
            output.push(`  ${formatTerminalOutput(dispName.padEnd(12), 'highlight')} - ${formatTerminalOutput(entry.description, 'main')}`);
          }
        });
        return output;
      }
    });

    // 2. WHOAMI
    this.register({
      name: 'whoami',
      description: 'Display developer profile overview and core philosophy',
      aliases: [],
      usage: 'whoami',
      execute: () => {
        return [
          `[${formatTerminalOutput('NAME', 'secondary')}]`,
          formatTerminalOutput('Bassant Hossny', 'main'),
          '',
          `[${formatTerminalOutput('ROLE', 'secondary')}]`,
          formatTerminalOutput('Full Stack Developer', 'main'),
          '',
          `[${formatTerminalOutput('PHILOSOPHY', 'secondary')}]`,
          formatTerminalOutput('Curious enough to build it.', 'main'),
          '',
          `[${formatTerminalOutput('ABOUT', 'secondary')}]`,
          formatTerminalOutput(
            'Passionate software developer specializing in high-performance web systems, reactive architectures, and developer console environments.',
            'main'
          )
        ];
      }
    });

    // 3. ABOUT
    this.register({
      name: 'about',
      description: 'Explore biography and educational details',
      aliases: ['bio'],
      usage: 'about',
      execute: () => {
        const output: string[] = [
          `[${formatTerminalOutput('BIOGRAPHY', 'secondary')}]`
        ];
        ABOUT_DATA.paragraphs.forEach(p => {
          output.push(formatTerminalOutput(p, 'main'));
          output.push('');
        });
        output.push(`[${formatTerminalOutput('EDUCATION', 'secondary')}]`);
        ABOUT_DATA.education.forEach(edu => {
          output.push(`• ${formatTerminalOutput(edu.degree, 'highlight')} in ${formatTerminalOutput(edu.specialization, 'main')}`);
          output.push(`  ${formatTerminalOutput(edu.description, 'muted')}`);
        });
        return output;
      }
    });

    // 4. PROJECTS
    this.register({
      name: 'projects',
      description: 'List featured projects and status',
      aliases: ['portfolio'],
      usage: 'projects',
      execute: () => {
        const output: string[] = [
          `[${formatTerminalOutput('FEATURED PROJECTS', 'highlight')}]`,
          ''
        ];
        PROJECTS_DATA.forEach(p => {
          output.push(`[${formatTerminalOutput(p.title.toUpperCase(), 'highlight')}]`);
          output.push(`${formatTerminalOutput('Description:', 'secondary')} ${formatTerminalOutput(p.description, 'main')}`);
          output.push(`${formatTerminalOutput('Tech Stack:', 'secondary')} ${formatTerminalOutput(p.techStack.join(', '), 'main')}`);
          output.push(`${formatTerminalOutput('Status:', 'secondary')} ${formatTerminalOutput(p.status, 'success')}`);
          output.push(formatSeparator());
        });
        output.pop(); // Remove trailing separator
        return output;
      }
    });

    // 5. SKILLS
    this.register({
      name: 'skills',
      description: 'View technical skills grouped by category',
      aliases: ['stack'],
      usage: 'skills',
      execute: () => {
        const output: string[] = [
          `[${formatTerminalOutput('TECHNICAL STACK', 'highlight')}]`,
          ''
        ];
        SKILLS_DATA.forEach(cat => {
          output.push(`[${formatTerminalOutput(cat.title.toUpperCase(), 'secondary')}]`);
          output.push(formatTerminalOutput(cat.description, 'muted'));
          output.push(`${formatTerminalOutput('Skills:', 'secondary')} ${formatTerminalOutput(cat.skills.join(' • '), 'main')}`);
          output.push('');
        });
        output.pop();
        return output;
      }
    });

    // 6. EXPERIENCE
    this.register({
      name: 'experience',
      description: 'Display career milestone timeline',
      aliases: ['work'],
      usage: 'experience',
      execute: () => {
        const output: string[] = [
          `[${formatTerminalOutput('CAREER TIMELINE', 'highlight')}]`,
          ''
        ];
        ABOUT_DATA.experience.forEach(exp => {
          output.push(`[${formatTerminalOutput(exp.period, 'secondary')}] ${formatTerminalOutput(exp.role, 'highlight')}`);
          output.push(formatTerminalOutput(exp.description, 'main'));
          output.push('');
        });
        output.pop();
        return output;
      }
    });

    // 7. CONTACT
    this.register({
      name: 'contact',
      description: 'Show contact details, email, and social networks',
      aliases: [],
      usage: 'contact',
      execute: () => {
        return [
          `[${formatTerminalOutput('CONTACT LINKS', 'highlight')}]`,
          '',
          formatLabelValue('Email:   ', 'bassant.hossny@gmail.com'),
          formatLabelValue('GitHub:  ', 'github.com/bassant'),
          formatLabelValue('LinkedIn:', 'linkedin.com/in/bassant')
        ];
      }
    });

    // 8. STACK
    this.register({
      name: 'stack',
      description: 'Print developer stack summary',
      aliases: [],
      usage: 'stack',
      execute: () => {
        return [
          `[${formatTerminalOutput('DEVELOPMENT STACK', 'highlight')}]`,
          '',
          formatLabelValue('Frontend:', 'Angular 20, TypeScript, Tailwind CSS, RxJS, Signals'),
          formatLabelValue('Backend: ', 'Node.js, Express, NestJS, RESTful APIs, Python, FastAPI'),
          formatLabelValue('Database:', 'MongoDB, Redis, PostgreSQL, MySQL'),
          formatLabelValue('DevOps:  ', 'Git, GitHub Actions, Docker, Webpack, Esbuild')
        ];
      }
    });

    // 9. RESUME
    this.register({
      name: 'resume',
      description: 'Display profile resume sheet link',
      aliases: ['cv'],
      usage: 'resume',
      execute: () => {
        return [
          `[${formatTerminalOutput('RESUME SUMMARY', 'highlight')}]`,
          '',
          formatLabelValue('Profile: ', 'Bassant Hossny - Full Stack / MEARN Developer'),
          formatLabelValue('Email:   ', 'bassant.hossny@gmail.com'),
          '',
          `${formatTerminalOutput('Download PDF:', 'secondary')} ${formatTerminalOutput('/assets/resume.pdf', 'highlight')}`
        ];
      }
    });

    // 10. CLEAR
    this.register({
      name: 'clear',
      description: 'Clear the terminal history logs',
      aliases: ['cls'],
      usage: 'clear',
      execute: () => {
        return '__TERMINAL_CLEAR__';
      }
    });

    // 11. INSPECT (Case Studies)
    this.register({
      name: 'inspect',
      description: 'Open a project case study breakdown',
      aliases: [],
      usage: 'inspect [rag-book-assistant | analytics-dashboard | search-indexer]',
      execute: (args) => {
        const target = args[0] ? args[0].toLowerCase().trim() : '';
        
        if (!target) {
          return [
            formatTerminalOutput('Error: Missing project name argument.', 'error'),
            `${formatTerminalOutput('Usage:', 'secondary')} inspect [rag-book-assistant | analytics-dashboard | search-indexer]`,
            '',
            formatTerminalOutput('Available projects:', 'secondary'),
            `  ${formatTerminalOutput('rag-book-assistant', 'highlight')}    - AI RAG Book Query system`,
            `  ${formatTerminalOutput('analytics-dashboard', 'highlight')}   - Real-time diagnostic console dashboard`,
            `  ${formatTerminalOutput('search-indexer', 'highlight')}        - Async Redis content indexing processor`
          ];
        }

        if (target.includes('rag') || target.includes('book')) {
          return [
            formatSeparator(),
            `[${formatTerminalOutput('CASE STUDY: RAG BOOK ASSISTANT', 'highlight')}]`,
            formatSeparator(),
            `• ${formatLabelValue('Project Type:', 'AI Application / Local Document Pipeline')}`,
            `• ${formatLabelValue('Purpose:', 'Allows users to index and query document content.')}`,
            `• ${formatLabelValue('Frontend Stack:', 'Angular standalone widgets')}`,
            `• ${formatLabelValue('Backend Stack:', 'NestJS, TypeScript, LangChain')}`,
            `• ${formatLabelValue('Database:', 'Vector Embeddings cache storage')}`,
            `• ${formatLabelValue('Architecture:', 'Microservices / RAG Context pipeline')}`,
            `• ${formatLabelValue('Key Features:', 'PDF text partitioning, context search matching')}`,
            `• ${formatLabelValue('Tech Challenges:', 'Token limits and context latency issues')}`,
            `• ${formatLabelValue('Notable Decisions:', 'Adopted local model pipelines for high security')}`,
            `• ${formatLabelValue('Current Status:', 'Production (V1.2.0)')}`,
            formatSeparator()
          ];
        }

        if (target.includes('analytics') || target.includes('dashboard')) {
          return [
            formatSeparator(),
            `[${formatTerminalOutput('CASE STUDY: DEVELOPER ANALYTICS DASHBOARD', 'highlight')}]`,
            formatSeparator(),
            `• ${formatLabelValue('Project Type:', 'Frontend Web Interface / Diagnostic Panel')}`,
            `• ${formatLabelValue('Purpose:', 'Visualizing log queues, metrics and Diagnostics.')}`,
            `• ${formatLabelValue('Frontend Stack:', 'Angular 20, RxJS state loops, Tailwind CSS')}`,
            `• ${formatLabelValue('Backend Stack:', 'Node.js, Express')}`,
            `• ${formatLabelValue('Database:', 'MongoDB metrics persistence')}`,
            `• ${formatLabelValue('Architecture:', 'Redux-like Reactive Streams (Signals + RxJS)')}`,
            `• ${formatLabelValue('Key Features:', 'Real-time metric plots, custom log streaming views')}`,
            `• ${formatLabelValue('Tech Challenges:', 'High update frequencies triggering layout lag')}`,
            `• ${formatLabelValue('Notable Decisions:', 'Coalesced and debounced event ticks to ensure 60fps')}`,
            `• ${formatLabelValue('Current Status:', 'Beta')}`,
            formatSeparator()
          ];
        }

        if (target.includes('indexer') || target.includes('search')) {
          return [
            formatSeparator(),
            `[${formatTerminalOutput('CASE STUDY: NEURAL SEARCH INDEXER', 'highlight')}]`,
            formatSeparator(),
            `• ${formatLabelValue('Project Type:', 'Backend Microservice / Data Pipeline Engine')}`,
            `• ${formatLabelValue('Purpose:', 'Dividing and pre-computing raw texts inside cache databases.')}`,
            `• ${formatLabelValue('Frontend Stack:', 'None (CLI-driven monitoring logging)')}`,
            `• ${formatLabelValue('Backend Stack:', 'Node.js, Python, FastAPI')}`,
            `• ${formatLabelValue('Database:', 'Redis (In-memory storage), MongoDB (Backing)')}`,
            `• ${formatLabelValue('Architecture:', 'Publisher-Subscriber message queues')}`,
            `• ${formatLabelValue('Key Features:', 'Regex-based indexing, parallel processing queues')}`,
            `• ${formatLabelValue('Tech Challenges:', 'Network socket limits and data locks during bulk ingestion')}`,
            `• ${formatLabelValue('Notable Decisions:', 'Implemented atomic Redis multi-transactions to prevent locks')}`,
            `• ${formatLabelValue('Current Status:', 'Archived')}`,
            formatSeparator()
          ];
        }

        return [
          formatTerminalOutput(`Error: Unknown project "${target}".`, 'error'),
          'Try: inspect rag-book-assistant, inspect analytics-dashboard, or inspect search-indexer'
        ];
      }
    });

    // 12. BASSANT .
    this.register({
      name: 'bassant',
      description: 'Launch Bassant Workspace',
      aliases: [],
      usage: 'bassant .',
      execute: (args) => {
        if (args[0] !== '.') {
          return [
            formatTerminalOutput('Error: Missing target directory.', 'error'),
            `Usage: ${formatTerminalOutput('bassant .', 'highlight')}`
          ];
        }
        return [
          formatTerminalOutput('Launching Bassant Workspace...', 'secondary'),
          '',
          `${formatTerminalOutput('✔', 'success')} ${formatTerminalOutput('Curiosity Engine Loaded', 'main')}`,
          `${formatTerminalOutput('✔', 'success')} ${formatTerminalOutput('Learning Mode Enabled', 'main')}`,
          `${formatTerminalOutput('✔', 'success')} ${formatTerminalOutput('Ideas Compiler Running', 'main')}`,
          `${formatTerminalOutput('✔', 'success')} ${formatTerminalOutput('Coffee Dependency Resolved', 'main')}`,
          '',
          formatTerminalOutput('Workspace Ready.', 'highlight'),
          '',
          formatTerminalOutput('Curious enough to build it.', 'muted')
        ];
      }
    });
  }
}
