import _ from 'lodash';
import { STATES } from '../constants.js';

const getAddedMessage = (key, value) => `Property ${key} was added with value: ${value}`;

const getUpdatedMessage = (key, value, prevValue) =>
  `Property '${key}' was updated. From ${prevValue} to ${value}`;

export default (data) => {
  const iter = (currentLevelData, prevPath = []) => {
    const result = Object.keys(currentLevelData)
      .sort()
      .flatMap((key) => {
        const { value, prevValue, state } = _.get(currentLevelData, [key]);

        const fullPathToValue = [...prevPath, key].join('.');

        if (state === STATES.modified) {
          if (_.isPlainObject(value)) {
            return [iter(value, [...prevPath, key]).join('\n')];
          }

          const valueToPrintFormat = {
            string: (pureValue) => `'${pureValue}'`,
            object: (pureValue) => {
              if (pureValue === null) {
                return pureValue;
              }

              return '[complex value]';
            },
            number: (pureValue) => pureValue,
            boolean: (pureValue) => pureValue,
          };

          return getUpdatedMessage(
            fullPathToValue,
            valueToPrintFormat[typeof value](value),
            valueToPrintFormat[typeof prevValue](prevValue)
          );
        }

        if (state === STATES.added) {
          const isAddedStringValue = typeof value === 'string';

          if (isAddedStringValue) {
            return getAddedMessage(`'${fullPathToValue}'`, `'${value}'`);
          }

          const isAddedComplexValue = value instanceof Object;

          if (isAddedComplexValue) {
            return getAddedMessage(`'${fullPathToValue}'`, '[complex value]');
          }

          return getAddedMessage(`'${fullPathToValue}'`, value);
        }

        if (state === STATES.deleted) {
          return `Property '${fullPathToValue}' was removed`;
        }

        return [];
      });

    return result;
  };

  const result = iter(data, []).join('\n');
  return result;
};
