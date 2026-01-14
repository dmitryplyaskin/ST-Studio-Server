import { Chalk } from 'chalk';
import { MODULE_NAME } from '../constants';

const chalk = new Chalk();

export const logger = {
    info(message: string, ...args: unknown[]): void {
        console.log(chalk.green(MODULE_NAME), message, ...args);
    },
    warn(message: string, ...args: unknown[]): void {
        console.warn(chalk.yellow(MODULE_NAME), message, ...args);
    },
    error(message: string, ...args: unknown[]): void {
        console.error(chalk.red(MODULE_NAME), message, ...args);
    },
};
