import fs from 'fs-extra';
import path from 'path';

/**
 * Parses a .svignore file and returns a list of ignore rules.
 * @param {string} rootDir - The root directory to parse the target .svignore from.
 * @returns {Promise<string[]>} - Array of trimmed rules, filtering out comments and empty lines.
 */
export const parseIgnore = async (rootDir: string): Promise<string[]> => {
  const ignorePath = path.join(rootDir, '.svignore');
  if (!(await fs.pathExists(ignorePath))) return [];

  const raw = await fs.readFile(ignorePath, 'utf8');
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
};

/**
 * Checks whether a given relative filepath should be ignored based on a list of ignore rules.
 * Simple prefix and trailing slash logic matching basic ignore behaviour.
 * @param {string} filepath - Posix-style relative file path.
 * @param {string[]} ignoreRules - Array of string match rules.
 * @returns {boolean} - true if file matches an ignore rule, false otherwise.
 */
export const isIgnored = (filepath: string, ignoreRules: string[]): boolean => {
  // Always ignore .stackvault core directory inherently
  if (filepath.startsWith('.stackvault')) {
    return true;
  }

  return ignoreRules.some(rule => {
    // Exact match or folder match
    if (filepath === rule) return true;
    
    // Directory rule like "node_modules/" or "node_modules"
    const isDirRule = rule.endsWith('/') ? rule.slice(0, -1) : rule;
    return filepath.startsWith(`${isDirRule}/`);
  });
};
