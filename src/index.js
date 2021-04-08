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

const makeDiff = (content1, content2) => {
  const iter = (currentLevelContent1 = null, currentLevelContent2 = null) => {
    const uniqJoinedKeys = Array.from(
      new Set([...Object.keys(currentLevelContent1 || {}), ...Object.keys(currentLevelContent2 || {})])
    );

    return uniqJoinedKeys.reduce((acc, key) => {
      const file1ContentValue = _.get(currentLevelContent1, key);
      const file2ContentValue = _.get(currentLevelContent2, key);

      const isValuesPlainObject = _.isPlainObject(file1ContentValue) && _.isPlainObject(file2ContentValue);

      const isObjectsValueDoesNotModified =
        isValuesPlainObject && _.isEqual(file1ContentValue, file2ContentValue);
      if (isObjectsValueDoesNotModified) {
        return {
          ...acc,
          [key]: {
            state: STATES.initial,
            value: iter(file1ContentValue, file2ContentValue),
          },
        };
      }

      const isObjectValueModifiedToAnotherObjectValue =
        isValuesPlainObject && !_.isEqual(file1ContentValue, file2ContentValue);
      if (isObjectValueModifiedToAnotherObjectValue) {
        return {
          ...acc,
          [key]: {
            state: STATES.modified,
            value: iter(file1ContentValue, file2ContentValue),
            prevValue: iter(file1ContentValue, file1ContentValue),
          },
        };
      }

      const isObjectValueDeleted = _.isPlainObject(file1ContentValue) && !_.has(currentLevelContent2, key);
      if (isObjectValueDeleted) {
        return {
          ...acc,
          [key]: {
            state: STATES.deleted,
            value: iter(file1ContentValue, file1ContentValue),
          },
        };
      }

      const isObjectValueAdded = !_.has(currentLevelContent1, key) && _.isPlainObject(file2ContentValue);
      if (isObjectValueAdded) {
        return {
          ...acc,
          [key]: {
            state: STATES.added,
            value: iter(file2ContentValue, file2ContentValue),
          },
        };
      }

      const isObjectValueModifiedToPrimitiveValue = _.isPlainObject(file1ContentValue);
      if (isObjectValueModifiedToPrimitiveValue) {
        return {
          ...acc,
          [key]: {
            state: STATES.modified,
            value: file2ContentValue,
            prevValue: iter(file1ContentValue, file1ContentValue),
          },
        };
      }

      const isPrimitiveValueModifiedToObjectValue = _.isPlainObject(file2ContentValue);
      if (isPrimitiveValueModifiedToObjectValue) {
        return {
          ...acc,
          [key]: {
            state: STATES.modified,
            value: iter(file1ContentValue, file2ContentValue),
            prevValue: file1ContentValue,
          },
        };
      }

      const isPrimitiveValueDoesNotChanged = file1ContentValue === file2ContentValue;

      if (isPrimitiveValueDoesNotChanged) {
        return { ...acc, [key]: { state: STATES.initial, value: file1ContentValue } };
      }

      const isPrimitiveValueDeleted = _.has(currentLevelContent1, key) && !_.has(currentLevelContent2, key);
      if (isPrimitiveValueDeleted) {
        return { ...acc, [key]: { state: STATES.deleted, value: file1ContentValue } };
      }

      const isPrimitiveValueAdded = !_.has(currentLevelContent1, key) && _.has(currentLevelContent2, key);
      if (isPrimitiveValueAdded) {
        return { ...acc, [key]: { state: STATES.added, value: file2ContentValue } };
      }

      return {
        ...acc,
        [key]: {
          state: STATES.modified,
          value: file2ContentValue,
          prevValue: file1ContentValue,
        },
      };
    }, {});
  };

  const result = iter(content1, content2);

  return result;
};

const makeReport = (diffTree) => {
  const iter = (diff, level = 1) => {
    if (!diff) {
      return [];
    }

    const sorted = _.sortBy(Object.keys(diff));

    const space = '  '.repeat(level);

    const parsed = sorted.reduce((acc, key) => {
      const { state, value, prevValue } = diff[key];

      const renderObjectValue = (currentValue) => {
        const result = [...iter(currentValue, level + 2).join('')].join('');
        return result;
      };

      const keyValueSeparator = value === '' ? ':' : ': ';
      const keyPrevValueSeparator = prevValue === '' ? ':' : ': ';

      if (state === STATES.added) {
        if (_.isPlainObject(value)) {
          return [
            ...acc,
            [space, '+ ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        return [...acc, `${space}${'+ '}${key}${keyValueSeparator}${value}\n`];
      }

      if (state === STATES.deleted) {
        if (_.isPlainObject(value)) {
          const result = [
            ...acc,
            [space, '- ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];

          return result;
        }

        return [...acc, `${space}${'- '}${key}${keyValueSeparator}${value}\n`];
      }

      if (state === STATES.modified) {
        if (_.isPlainObject(value) && _.isPlainObject(prevValue)) {
          return [
            ...acc,
            [space, '  ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        const isPrimitiveValueModifiedToObjectValue = _.isPlainObject(value);

        if (isPrimitiveValueModifiedToObjectValue) {
          return [
            ...acc,
            [`${space}${'- '}${key}${keyPrevValueSeparator}${prevValue}\n`].join(''),
            [space, '  ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        const isObjectValueModifiedToPrimitiveValue = _.isPlainObject(prevValue);
        if (isObjectValueModifiedToPrimitiveValue) {
          return [
            ...acc,
            [space, '- ', key, ': ', '{\n'].join(''),
            renderObjectValue(prevValue),
            [space, '  ', '}', '\n'].join(''),
            [`${space}${'+ '}${key}${keyValueSeparator}${value}\n`].join(''),
          ];
        }

        return [
          ...acc,
          [`${space}${'- '}${key}${keyPrevValueSeparator}${prevValue}\n`].join(''),
          [`${space}${'+ '}${key}${keyValueSeparator}${value}\n`].join(''),
        ];
      }

      if (state === STATES.initial) {
        if (_.isPlainObject(value)) {
          return [
            ...acc,
            [space, '  ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        return [...acc, `${space}${'  '}${key}${keyValueSeparator}${value}\n`];
      }

      throw new Error(`Unexpected state: ${state}`);
    }, []);

    return parsed;
  };

  return ['{\n', `${iter(diffTree).join('')}`, '}'].join('');
};

export default ({ filepath1, filepath2, format = 'json', readFile = defaultReadFile }) => {
  const parse = makeParser(format);

  const parsedContent1 = parse(readFile(filepath1));
  const parsedContent2 = parse(readFile(filepath2));

  const diff = makeDiff(parsedContent1, parsedContent2);

  const result = makeReport(diff);

  return result;
};
