import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import process from 'process';
import makeParser from './parsers.js';

const defaultReadFile = (filePath) => {
  const preparedPath = path.isAbsolute(filePath)
    ? path.join(process.cwd(), path.normalize(filePath))
    : path.resolve(process.cwd(), path.normalize(filePath));

  return fs.readFileSync(preparedPath, { encoding: 'utf8' });
};

const STATES = {
  initial: 'initial',
  added: 'added',
  deleted: 'deleted',
  modified: 'modified',
};

const makeDiff = (file1Content, file2Content) => {
  const uniqJoinedKeys = Array.from(new Set([...Object.keys(file1Content), ...Object.keys(file2Content)]));

  return uniqJoinedKeys.reduce((acc, key) => {
    const file1ContentValue = file1Content[key];
    const file2ContentValue = file2Content[key];

    const isNotChanged = file1ContentValue === file2ContentValue;

    if (isNotChanged) {
      return [...acc, { key, state: STATES.initial, value: file1ContentValue }];
    }

    const isDeleted = _.has(file1Content, key) && !_.has(file2Content, key);
    if (isDeleted) {
      return [...acc, { key, state: STATES.deleted, value: file1ContentValue }];
    }

    const isAdded = !_.has(file1Content, key) && _.has(file2Content, key);
    if (isAdded) {
      return [...acc, { key, state: STATES.added, value: file2ContentValue }];
    }

    return [...acc, { key, state: STATES.modified, value: file2ContentValue, prevValue: file1ContentValue }];
  }, []);
};

const makeReport = (diffTree) => {
  const sorted = _.sortBy(diffTree, ['key']);

  const space = '  ';

  const parsed = sorted
    .reduce((acc, { key, state, value, prevValue }) => {
      switch (state) {
        case STATES.added:
          return [...acc, `${space}+ ${key}: ${value}`];

        case STATES.deleted:
          return [...acc, `${space}- ${key}: ${value}`];

        case STATES.modified:
          return [...acc, `${space}- ${key}: ${prevValue}`, `${space}+ ${key}: ${value}`];

        case STATES.initial:
          return [...acc, `${space}  ${key}: ${value}`];

        default:
          throw new Error(`Unexpected state: ${state}`);
      }
    }, [])
    .join('\n');

  return ['{', parsed, '}'].join('\n');
};

export default ({ filepath1, filepath2, format = 'json', readFile = defaultReadFile }) => {
  const parse = makeParser(format);

  const file1Content = parse(readFile(filepath1));
  const file2Content = parse(readFile(filepath2));

  const diffTree = makeDiff(file1Content, file2Content);

  const result = makeReport(diffTree);

  return result;
};
