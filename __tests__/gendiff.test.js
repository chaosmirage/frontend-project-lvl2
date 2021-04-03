import { test, expect } from '@jest/globals';
import gendiff from '../src/index.js';
import readFile from '../src/utils/readFile.js';

const filepath1 = 'file1.json';
const filepath2 = 'file2.json';

const result = readFile('result.txt').trim();

test('Сравнение плоских списков', () => {
  expect(gendiff({ filepath1, filepath2, readFile })).toBe(result);
});
