import _ from 'lodash';
import { STATES } from '../constants.js';

const getAddedMessage = (key, value) => `Property ${key} was added with value: ${value}`;

const getUpdatedMessage = (key, value, prevValue) =>
  `Property '${key}' was updated. From ${prevValue} to ${value}`;

export default (data) => {
  const iter = (currentLevelData, prevPath = []) => {
    const result = _.sortBy(currentLevelData, 'name').map(({ name, type, value, prevValue, children }) => {
      const fullPathToValue = [...prevPath, name].join('.');

      if (type === STATES.modified) {
        if (children) {
          const test2 = iter(children, [...prevPath, name]);

          return iter(children, [...prevPath, name])
            .filter((item) => item !== null && item !== '')
            .join('\n');
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

      if (type === STATES.added) {
        const isAddedStringValue = typeof value === 'string';

        if (isAddedStringValue) {
          return getAddedMessage(`'${fullPathToValue}'`, `'${value}'`);
        }

        if (children) {
          return getAddedMessage(`'${fullPathToValue}'`, '[complex value]');
        }

        return getAddedMessage(`'${fullPathToValue}'`, value);
      }

      if (type === STATES.deleted) {
        return `Property '${fullPathToValue}' was removed`;
      }

      return null;
    });

    return result;
  };

  const test = iter(data, []);

  const result = iter(data, [])
    .filter((item) => item !== null)
    .join('\n');
  return result;
};
