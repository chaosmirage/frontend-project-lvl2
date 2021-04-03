import yaml from 'js-yaml';

export default (format) => {
  switch (format) {
    case 'json':
      return JSON.parse;
    case 'yaml':
      return yaml.load;
    default:
      throw new Error(`Unexpected format: ${format}`);
  }
};
