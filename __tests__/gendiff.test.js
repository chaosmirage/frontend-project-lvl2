import { test, expect } from '@jest/globals';
import gendiff from '../src/index.js';
import readFile from '../src/utils/readFixtureFile.js';

const result = readFile('result.txt').trim();

test('Сравнение JSON файлов', () => {
  const filepath1 = '/json/file1.json';
  const filepath2 = '/json/file2.json';

  expect(gendiff({ filepath1, filepath2, readFile })).toBe(result);
});

test('Сравнение YAML файлов', () => {
  const filepath1 = '/yaml/file1.yml';
  const filepath2 = '/yaml/file2.yml';

  expect(gendiff({ filepath1, filepath2, readFile })).toBe(result);
});
