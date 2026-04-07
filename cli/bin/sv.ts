#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from '../commands/init.js';
import { commitCommand } from '../commands/commit.js';
import { statusCommand } from '../commands/status.js';
import { logCommand } from '../commands/log.js';

import { pushCommand } from '../commands/push.js';
import { pullCommand } from '../commands/pull.js';
import { cloneCommand } from '../commands/clone.js';
import { remoteCommand } from '../commands/remote.js';

const program = new Command();

program
  .name('sv')
  .description('StackVault: An open-source mini version control system inspired by Git')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize an empty repository')
  .action(() => initCommand());

program
  .command('commit')
  .description('Commit changes to the repository')
  .requiredOption('-m, --message <msg>', 'commit message')
  .action((options: { message: string }) => commitCommand(options.message));

program
  .command('status')
  .description('Show the working tree status')
  .action(() => statusCommand());

program
  .command('log')
  .description('Show commit logs')
  .action(() => logCommand());

program
  .command('remote add <name> <url>')
  .description('Add a remote repository url')
  .action((name: string, url: string) => remoteCommand(name, url));

program
  .command('push [remote] [branch]')
  .description('Push commits to remote (branch currently ignored for simplest setup)')
  .action((remote?: string, branch?: string) => pushCommand(remote, branch));

program
  .command('pull [remote] [branch]')
  .description('Pull commits from remote')
  .action((remote?: string, branch?: string) => pullCommand(remote, branch));

program
  .command('clone <url>')
  .description('Clone a repository')
  .option('--path <path>', 'Partial clone path prefix')
  .action((url: string, options: { path?: string }) => cloneCommand(url, options));

program.parse(process.argv);
