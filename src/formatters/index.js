import stylish from './stylish.js';
import plain from './plain.js';

export default (format) => {
  switch (format) {
    case 'stylish':
      return stylish;

    case 'plain':
      return plain;

    case 'json':
      return (data) => JSON.stringify(data, null, 2);

    default:
      throw new Error(`Unexpected report format: ${format}`);
  }
};
