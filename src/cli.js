import { Command } from 'commander/esm.mjs';
import gendiff from './index.js';

export default () => {
  const program = new Command();

  program
    .description('Compares two configuration files and shows a difference')
    .version('0.0.1')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format')
    .action((filepath1, filepath2, options) => {
      const { format } = options;
      const result = gendiff({ filepath1, filepath2, format });

      console.log(result);
    });

  program.parse();
};
