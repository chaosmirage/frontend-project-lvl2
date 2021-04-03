import { test, expect } from '@jest/globals';
import gendiff from '../src/index.js';
import readFile from '../src/utils/readFixtureFile.js';

const filepath1 = '/yaml/file1.yml';
const filepath2 = '/yaml/file2.yml';

const result = readFile('result.txt').trim();

test('Сравнение плоских списков, YAML', () => {
  expect(gendiff({ filepath1, filepath2, readFile, format: 'yaml' })).toBe(result);
});
