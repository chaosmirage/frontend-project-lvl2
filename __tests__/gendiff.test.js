import { test, expect } from '@jest/globals';
import gendiff from '../src/index.js';

const filepath1 = 'filepath1';
const filepath2 = 'filepath2';

const file1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const file2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

const result = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test('Сравнение плоских списков', () => {
  expect(gendiff({ filepath1, filepath2 })).toBe(result);
});
