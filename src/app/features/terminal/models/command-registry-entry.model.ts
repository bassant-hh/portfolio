export interface CommandRegistryEntry {
  name: string;
  description: string;
  aliases: string[];
  usage: string;
  execute: (args: string[]) => string | string[];
}
