import yaml from 'js-yaml';

export default (format) => {
  switch (format) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.load;
    default:
      throw new Error(`Unexpected file format: ${format}`);
  }
};
