import _ from 'lodash';
import { STATES } from './constants.js';

export default (data) => {
  const iter = (currentLevelData, level = 1) => {
    if (!currentLevelData) {
      return [];
    }

    const sorted = _.sortBy(Object.keys(currentLevelData));

    const space = '  '.repeat(level);

    const parsed = sorted.flatMap((key) => {
      const { state, value, prevValue } = currentLevelData[key];

      const renderObjectValue = (currentValue) => {
        const result = [...iter(currentValue, level + 2).join('')].join('');
        return result;
      };

      const keyValueSeparator = value === '' ? ':' : ': ';
      const keyPrevValueSeparator = prevValue === '' ? ':' : ': ';

      if (state === STATES.added) {
        if (_.isPlainObject(value)) {
          return [
            [space, '+ ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        return [`${space}${'+ '}${key}${keyValueSeparator}${value}\n`];
      }

      if (state === STATES.deleted) {
        if (_.isPlainObject(value)) {
          const result = [
            [space, '- ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];

          return result;
        }

        return [`${space}${'- '}${key}${keyValueSeparator}${value}\n`];
      }

      if (state === STATES.modified) {
        if (_.isPlainObject(value) && _.isPlainObject(prevValue)) {
          return [
            [space, '  ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        const isPrimitiveValueModifiedToObjectValue = _.isPlainObject(value);

        if (isPrimitiveValueModifiedToObjectValue) {
          return [
            [`${space}${'- '}${key}${keyPrevValueSeparator}${prevValue}\n`].join(''),
            [space, '  ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        const isObjectValueModifiedToPrimitiveValue = _.isPlainObject(prevValue);
        if (isObjectValueModifiedToPrimitiveValue) {
          return [
            [space, '- ', key, ': ', '{\n'].join(''),
            renderObjectValue(prevValue),
            [space, '  ', '}', '\n'].join(''),
            [`${space}${'+ '}${key}${keyValueSeparator}${value}\n`].join(''),
          ];
        }

        return [
          [`${space}${'- '}${key}${keyPrevValueSeparator}${prevValue}\n`].join(''),
          [`${space}${'+ '}${key}${keyValueSeparator}${value}\n`].join(''),
        ];
      }

      if (state === STATES.initial) {
        if (_.isPlainObject(value)) {
          return [
            [space, '  ', key, ': ', '{\n'].join(''),
            renderObjectValue(value),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        return [`${space}${'  '}${key}${keyValueSeparator}${value}\n`];
      }

      throw new Error(`Unexpected state: ${state}`);
    });

    return parsed;
  };

  return ['{\n', `${iter(data).join('')}`, '}'].join('');
};