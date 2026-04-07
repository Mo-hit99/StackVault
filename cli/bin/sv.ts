#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from '../commands/init.js';
import { addCommand, unstageCommand } from '../commands/add.js';
import { commitCommand } from '../commands/commit.js';
import { statusCommand } from '../commands/status.js';
import { logCommand } from '../commands/log.js';

import { pushCommand } from '../commands/push.js';
import { pullCommand } from '../commands/pull.js';
import { cloneCommand } from '../commands/clone.js';
import { remoteCommand } from '../commands/remote.js';
import { loginCommand, registerCommand, createRepoCommand } from '../commands/auth.js';

const program = new Command();

program
  .name('gexra')
  .description('Gexra: A modern version control system with CLI and web interface')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize an empty repository')
  .action(() => initCommand());

program
  .command('add [files...]')
  .description('Add file(s) to staging area')
  .option('-p, --path <path>', 'Add only files under path')
  .action((files: string[], options: { path?: string }) => addCommand(files, options.path));

program
  .command('reset [files...]')
  .description('Remove file(s) from staging area')
  .action((files: string[]) => unstageCommand(files.length > 0 ? files : ['.']));

program
  .command('commit')
  .description('Commit changes to the repository')
  .requiredOption('-m, --message <msg>', 'commit message')
  .option('-p, --path <path>', 'Commit only files under path')
  .action((options: { message: string; path?: string }) => commitCommand(options.message, options.path));

program
  .command('status')
  .description('Show the working tree status')
  .action(() => statusCommand());

program
  .command('log')
  .description('Show commit logs')
  .action(() => logCommand());

program
  .command('login <email> <password>')
  .description('Login to StackVault server')
  .option('-u, --url <url>', 'Server URL (e.g., http://localhost:5000)')
  .action((email: string, password: string, options: { url?: string }) => 
    loginCommand(email, password, options.url));

program
  .command('register <username> <email> <password>')
  .description('Register a new StackVault account')
  .option('-u, --url <url>', 'Server URL (e.g., http://localhost:5000)')
  .action((username: string, email: string, password: string, options: { url?: string }) => 
    registerCommand(username, email, password, options.url));

program
  .command('create-repo <name>')
  .description('Create a new repository on the server')
  .option('-d, --description <desc>', 'Repository description')
  .option('-p, --private', 'Make repository private')
  .action((name: string, options: { description?: string; private?: boolean }) => 
    createRepoCommand(name, options.description, options.private));

program
  .command('remote')
  .description('Manage remote repositories')
  .argument('<action>', 'Action to perform (add)')
  .argument('<name>', 'Remote name (e.g., origin)')
  .argument('<url>', 'Remote URL')
  .action((action: string, name: string, url: string) => {
    if (action === 'add') {
      remoteCommand(name, url);
    } else {
      console.log('Unknown action. Use: gexra remote add <name> <url>');
    }
  });

program
  .command('push [remote] [branch]')
  .description('Push commits to remote')
  .option('-p, --path <path>', 'Push only files under path')
  .action((remote?: string, branch?: string, options?: { path?: string }) => pushCommand(remote, branch, options?.path));

program
  .command('pull [remote] [branch]')
  .description('Pull commits from remote')
  .option('-p, --path <path>', 'Pull only files under path')
  .action((remote?: string, branch?: string, options?: { path?: string }) => pullCommand(remote, branch, options?.path));

program
  .command('clone <url>')
  .description('Clone a repository')
  .option('--path <path>', 'Partial clone path prefix')
  .action((url: string, options: { path?: string }) => cloneCommand(url, options));

program.parse(process.argv);
