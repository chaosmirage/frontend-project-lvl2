import { Command } from 'commander/esm.mjs';

export default () => {
  const program = new Command();

  program
    .description('Compares two configuration files and shows a difference')
    .version('0.0.1')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format')
    .action((filepath1, filepath2, options) => {
      console.log(filepath1);
      console.log(filepath2);
      console.log(options);
    });

  program.parse();
};
