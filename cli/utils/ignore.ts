import fs from 'fs-extra';
import path from 'path';

const PROTECTED_DIRECTORIES = ['.gexra', '.git'];

/**
 * Parses a .gexraignore file and returns a list of ignore rules.
 */
export const parseIgnore = async (rootDir: string): Promise<string[]> => {
  const ignorePath = path.join(rootDir, '.gexraignore');
  if (!(await fs.pathExists(ignorePath))) return [];

  const raw = await fs.readFile(ignorePath, 'utf8');
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
};

export const isProtectedPath = (filepath: string): boolean => {
  const normalizedPath = filepath.split(path.sep).join('/');
  return PROTECTED_DIRECTORIES.some(
    protectedDir =>
      normalizedPath === protectedDir || normalizedPath.startsWith(`${protectedDir}/`)
  );
};

/**
 * Checks whether a given relative filepath should be ignored based on a list of ignore rules.
 */
export const isIgnored = (filepath: string, ignoreRules: string[]): boolean => {
  // Always ignore internal VCS directories
  if (isProtectedPath(filepath)) {
    return true;
  }

  for (let rule of ignoreRules) {
    // Remove trailing slash for consistent matching
    rule = rule.replace(/\/$/, '');
    
    // Exact match
    if (filepath === rule) return true;
    
    // Directory match - file is inside the directory (any depth)
    if (filepath.includes('/' + rule + '/') || filepath.startsWith(rule + '/')) {
      return true;
    }
    
    // Wildcard pattern support (e.g., *.log, *.swp)
    if (rule.includes('*')) {
      const regex = new RegExp('^' + rule.replace(/\./g, '\\.').replace(/\*/g, '[^/]*') + '$');
      if (regex.test(filepath)) {
        return true;
      }
    }
  }

  return false;
};
