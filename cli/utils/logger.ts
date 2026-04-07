import chalk from 'chalk';

/**
 * Logger utility wrapping chalk for consistent console output.
 */

/**
 * Prints success messages in green.
 * @param {string} msg 
 */
export const success = (msg: string): void => {
  console.log(chalk.green(msg));
};

/**
 * Prints error messages in red.
 * @param {string} msg 
 */
export const error = (msg: string): void => {
  console.error(chalk.red(msg));
};

/**
 * Prints info/warning messages in yellow.
 * @param {string} msg 
 */
export const info = (msg: string): void => {
  console.log(chalk.yellow(msg));
};

/**
 * Prints header/category messages in cyan.
 * @param {string} msg 
 */
export const header = (msg: string): void => {
  console.log(chalk.cyan(msg));
};

/**
 * Prints neutral info messages in white/default.
 * @param {string} msg 
 */
export const neutral = (msg: string): void => {
  console.log(msg);
};
