import { Injectable, inject } from '@angular/core';
import { CommandRegistryEntry } from '../../features/terminal/models/command-registry-entry.model';
import { ABOUT_DATA } from '../../features/about/data/about.data';
import { SKILLS_DATA } from '../../features/skills/data/skills.data';
import { CONTACT_DATA } from '../../features/contact/data/contact.data';
import { HOME_DATA } from '../../features/home/data/home.data';
import { PROJECTS_DATA } from '../../features/projects/data/projects.data';
import {
  formatTerminalOutput,
  formatLabelValue,
  formatSeparator
} from '../../features/terminal/helpers/terminal-formatter';

@Injectable({
  providedIn: 'root'
})
export class UnknownCommandStrategy {
  handle(command: string, _args: string[]): string | string[] {
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
          formatTerminalOutput(HOME_DATA.name, 'main'),
          '',
          `[${formatTerminalOutput('ROLE', 'secondary')}]`,
          formatTerminalOutput(HOME_DATA.role, 'main'),
          '',
          `[${formatTerminalOutput('PHILOSOPHY', 'secondary')}]`,
          formatTerminalOutput('Curious enough to build it.', 'main'),
          '',
          `[${formatTerminalOutput('ABOUT', 'secondary')}]`,
          formatTerminalOutput(ABOUT_DATA.paragraphs[0], 'main')
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
          output.push(`• ${formatTerminalOutput(edu.degree, 'highlight')} — ${formatTerminalOutput(edu.specialization, 'main')}`);
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
        return [
          formatTerminalOutput('Opening Projects Workspace...', 'muted')
        ];
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
        const githubHandle = CONTACT_DATA.githubUrl.replace(/^https?:\/\//, '');
        const linkedinHandle = CONTACT_DATA.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '');
        return [
          `[${formatTerminalOutput('CONTACT LINKS', 'highlight')}]`,
          '',
          formatLabelValue('Email:   ', CONTACT_DATA.emailAddress),
          formatLabelValue('GitHub:  ', githubHandle),
          formatLabelValue('LinkedIn:', linkedinHandle)
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
          formatLabelValue('Frontend:', 'Angular, React, TypeScript, JavaScript, HTML5, CSS3, Bootstrap, Tailwind CSS, RxJS, Signals'),
          formatLabelValue('Backend: ', 'Node.js, Express.js, NestJS, REST APIs, JWT, Socket.IO'),
          formatLabelValue('Database:', 'MongoDB, Mongoose, PostgreSQL, MySQL, Prisma'),
          formatLabelValue('Tools:   ', 'Git, GitHub, Docker, Leaflet')
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
          formatLabelValue('Profile: ', `${HOME_DATA.name} - ${HOME_DATA.role}`),
          formatLabelValue('Email:   ', CONTACT_DATA.emailAddress),
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
      usage: 'inspect [project-name]',
      execute: (args) => {
        const target = args[0] ? args[0].toLowerCase().trim() : '';

        // Build slug list from real projects for the help message
        const slugList = PROJECTS_DATA
          .map(p => p.title.toLowerCase().replace(/\s+/g, '-'))
          .join(' | ');

        if (!target) {
          const lines: string[] = [
            formatTerminalOutput('Error: Missing project name argument.', 'error'),
            `${formatTerminalOutput('Usage:', 'secondary')} inspect [project-name]`,
            '',
            formatTerminalOutput('Available projects:', 'secondary')
          ];
          PROJECTS_DATA.forEach(p => {
            lines.push(`  ${formatTerminalOutput(p.title.toLowerCase().replace(/\s+/g, '-'), 'highlight')}  - ${p.description.split('.')[0]}.`);
          });
          return lines;
        }

        // Match against real PROJECTS_DATA by title word overlap
        const matched = PROJECTS_DATA.find(p =>
          p.title.toLowerCase().replace(/\s+/g, '-').includes(target) ||
          target.includes(p.title.toLowerCase().replace(/\s+/g, '-')) ||
          p.title.toLowerCase().split(' ').some(word => target.includes(word))
        );

        if (!matched) {
          return [
            formatTerminalOutput(`Error: Unknown project "${target}".`, 'error'),
            `${formatTerminalOutput('Try:', 'secondary')} inspect [${slugList}]`
          ];
        }

        const lines: string[] = [
          formatSeparator(),
          `[${formatTerminalOutput('PROJECT: ' + matched.title.toUpperCase(), 'highlight')}]`,
          formatSeparator(),
          `• ${formatLabelValue('Description:', matched.description)}`,
          `• ${formatLabelValue('Category:   ', matched.category.charAt(0).toUpperCase() + matched.category.slice(1))}`,
          `• ${formatLabelValue('Tech Stack: ', matched.techStack.join(', '))}`,
          `• ${formatLabelValue('Status:     ', matched.status)}`
        ];
        if (matched.liveUrl) {
          lines.push(`• ${formatLabelValue('Live URL:   ', matched.liveUrl)}`);
        }
        if (matched.gitUrl) {
          lines.push(`• ${formatLabelValue('Repository: ', matched.gitUrl)}`);
        }
        lines.push(formatSeparator());
        return lines;
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

    // 13. CERTIFICATES
    this.register({
      name: 'certificates',
      description: 'View technical certifications',
      aliases: ['certs'],
      usage: 'certificates',
      execute: () => {
        return [
          formatTerminalOutput('Opening Certificates Workspace...', 'muted')
        ];
      }
    });
  }
}
