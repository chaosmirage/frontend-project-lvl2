import { test, expect } from '@jest/globals';
import gendiff from '../src/index.js';
import readFile from '../src/utils/readFixtureFile.js';

const filepath1 = '/json/file1.json';
const filepath2 = '/json/file2.json';

const result = readFile('result.txt').trim();

test('Сравнение плоских списков, JSON', () => {
  expect(gendiff({ filepath1, filepath2, readFile, format: 'json' })).toBe(result);
});
