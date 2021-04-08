import stylish from './stylish.js';

export default (format) => {
  switch (format) {
    case 'stylish':
      return stylish;

    default:
      throw new Error(`Unexpected report format: ${format}`);
  }
};
