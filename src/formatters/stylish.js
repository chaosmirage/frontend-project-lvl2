import _ from 'lodash';
import { STATES } from '../constants.js';

export default (data) => {
  const iter = (currentLevelData, level = 1) => {
    if (!currentLevelData) {
      return [];
    }

    const sorted = _.sortBy(currentLevelData, 'name');

    const space = '  '.repeat(level);

    const parsed = sorted.flatMap(({
      name, type, value, prevValue, children,
    }) => {
      if (type === STATES.modified) {
        const isObjectValueChangeToObjectValue = children && prevValue instanceof Array;
        if (isObjectValueChangeToObjectValue) {
          return [
            [space, '  ', name, ': ', '{\n'].join(''),
            iter(children, level + 2).join(''),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        const isPrimitiveValueModifiedToObjectValue = children;
        if (isPrimitiveValueModifiedToObjectValue) {
          return [
            [`${space}${'- '}${name}: ${prevValue}\n`].join(''),
            [space, '+ ', name, ': ', '{\n'].join(''),
            iter(children, level + 2).join(''),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        const isObjectValueModifiedToPrimitiveValue = prevValue instanceof Array;
        if (isObjectValueModifiedToPrimitiveValue) {
          return [
            [space, '- ', name, ': ', '{\n'].join(''),
            iter(prevValue, level + 2).join(''),
            [space, '  ', '}', '\n'].join(''),
            [`${space}${'+ '}${name}: ${value}\n`].join(''),
          ];
        }

        return [
          [`${space}${'- '}${name}: ${prevValue}\n`].join(''),
          [`${space}${'+ '}${name}: ${value}\n`].join(''),
        ];
      }

      if (type === STATES.added) {
        if (children) {
          return [
            [space, '+ ', name, ': ', '{\n'].join(''),
            iter(children, level + 2).join(''),
            [space, '  ', '}', '\n'].join(''),
          ];
        }

        return [`${space}${'+ '}${name}: ${value}\n`];
      }

      if (type === STATES.initial) {
        if (children) {
          return [
            [space, '  ', name, ': ', '{\n'].join(''),
            iter(children, level + 2).join(''),
            [space, '  ', '}', '\n'].join(''),
          ];
        }
        return [`${space}${'  '}${name}: ${value}\n`];
      }

      if (type === STATES.deleted) {
        if (children) {
          const result = [
            [space, '- ', name, ': ', '{\n'].join(''),
            iter(children, level + 2).join(''),
            [space, '  ', '}', '\n'].join(''),
          ];

          return result;
        }

        return [`${space}${'- '}${name}: ${value}\n`];
      }

      throw new Error(`Unexpected type: ${type}`);
    });

    return parsed;
  };

  return ['{\n', `${iter(data).join('')}`, '}'].join('');
};
