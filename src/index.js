import fs from 'fs';
import path from 'path';
import process from 'process';
import makeParser from './parsers.js';
import makeFormatter from './formatters/index.js';
import makeDiff from './makeDiff.js';

const defaultReadFile = (filePath) => {
  const preparedPath = path.isAbsolute(filePath)
    ? path.normalize(filePath)
    : path.resolve(process.cwd(), path.normalize(filePath));

  return fs.readFileSync(preparedPath, { encoding: 'utf8' });
};

export default (filepath1, filepath2, formatName = 'stylish', readFile = defaultReadFile) => {
  const parse = makeParser(path.extname(filepath1));
  const format = makeFormatter(formatName);

  const parsedContent1 = parse(readFile(filepath1));
  const parsedContent2 = parse(readFile(filepath2));

  const diff = makeDiff(parsedContent1, parsedContent2);

  const result = format(diff);

  return result;
};
