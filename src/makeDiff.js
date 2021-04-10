import _ from 'lodash';
import { STATES } from './constants.js';

export default (content1, content2) => {
  const iter = (currentLevelContent1 = null, currentLevelContent2 = null) => {
    const uniqJoinedKeys = Array.from(
      new Set([...Object.keys(currentLevelContent1 || {}), ...Object.keys(currentLevelContent2 || {})])
    );

    return uniqJoinedKeys.map((key) => {
      const file1ContentValue = _.get(currentLevelContent1, key);
      const file2ContentValue = _.get(currentLevelContent2, key);

      const isPrevValuePlainObject = _.isPlainObject(file1ContentValue);
      const isNewValuePlainObject = _.isPlainObject(file2ContentValue);

      const isObjectValueChangeToObjectValue =
        _.isPlainObject(file1ContentValue) && _.isPlainObject(file2ContentValue);

      if (isObjectValueChangeToObjectValue) {
        const children = iter(file1ContentValue, file2ContentValue);

        const isInitial = children.every((item) => item.type === STATES.initial);

        if (isInitial) {
          return {
            name: key,
            type: STATES.initial,
            children,
          };
        }

        return {
          name: key,
          type: STATES.modified,
          children,
          prevValue: iter(file1ContentValue, file1ContentValue),
        };
      }

      const isObjectValueDeleted = isPrevValuePlainObject && !_.has(currentLevelContent2, key);
      if (isObjectValueDeleted) {
        const children = iter(file1ContentValue, file1ContentValue);

        return {
          name: key,
          type: STATES.deleted,
          children,
        };
      }

      const isObjectValueAdded = !_.has(currentLevelContent1, key) && isNewValuePlainObject;
      if (isObjectValueAdded) {
        const children = iter(file2ContentValue, file2ContentValue);

        return {
          name: key,
          type: STATES.added,
          children,
        };
      }

      const isObjectValueModifiedToPrimitiveValue = _.isPlainObject(file1ContentValue);
      if (isObjectValueModifiedToPrimitiveValue) {
        return {
          name: key,
          type: STATES.modified,
          value: file2ContentValue,
          prevValue: iter(file1ContentValue, file1ContentValue),
        };
      }

      const isPrimitiveValueModifiedToObjectValue = _.isPlainObject(file2ContentValue);
      if (isPrimitiveValueModifiedToObjectValue) {
        return {
          name: key,
          type: STATES.modified,
          children: iter(file2ContentValue, file2ContentValue),
          prevValue: file1ContentValue,
        };
      }

      const isPrimitiveValueDoesNotChanged = file1ContentValue === file2ContentValue;

      if (isPrimitiveValueDoesNotChanged) {
        return {
          name: key,
          type: STATES.initial,
          value: file1ContentValue,
        };
      }

      const isPrimitiveValueDeleted = _.has(currentLevelContent1, key) && !_.has(currentLevelContent2, key);
      if (isPrimitiveValueDeleted) {
        return {
          name: key,
          type: STATES.deleted,
          value: file1ContentValue,
        };
      }

      const isPrimitiveValueAdded = !_.has(currentLevelContent1, key) && _.has(currentLevelContent2, key);
      if (isPrimitiveValueAdded) {
        return {
          name: key,
          type: STATES.added,
          value: file2ContentValue,
        };
      }

      return {
        name: key,
        type: STATES.modified,
        value: file2ContentValue,
        prevValue: file1ContentValue,
      };
    });
  };

  const result = iter(content1, content2);

  return result;
};
