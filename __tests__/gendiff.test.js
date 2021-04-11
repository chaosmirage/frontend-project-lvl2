import { test, expect, describe } from '@jest/globals';
import gendiff from '../src/index.js';
import readFile from '../src/utils/readFixtureFile.js';

describe('Формат вывода: stylish', () => {
  const result = readFile('stylish-result.txt').trim();

  test('Сравнение JSON файлов', () => {
    const filepath1 = '/file1.json';
    const filepath2 = '/file2.json';

    expect(gendiff(filepath1, filepath2, 'stylish', readFile)).toBe(result);
  });

  test('Сравнение YAML файлов', () => {
    const filepath1 = '/file1.yml';
    const filepath2 = '/file2.yml';

    expect(gendiff(filepath1, filepath2, 'stylish', readFile)).toBe(result);
  });
});

describe('Формат вывода: plain', () => {
  const result = readFile('plain-result.txt').trim();
  const format = 'plain';

  test('Сравнение JSON файлов', () => {
    const filepath1 = '/file1.json';
    const filepath2 = '/file2.json';

    expect(gendiff(filepath1, filepath2, format, readFile)).toBe(result);
  });

  test('Сравнение YAML файлов', () => {
    const filepath1 = '/file1.yml';
    const filepath2 = '/file2.yml';

    expect(gendiff(filepath1, filepath2, format, readFile)).toBe(result);
  });
});

describe('Формат вывода: json', () => {
  const result = readFile('json-result.txt').trim();
  const format = 'json';

  test('Сравнение JSON файлов', () => {
    const filepath1 = '/file1.json';
    const filepath2 = '/file2.json';

    expect(gendiff(filepath1, filepath2, format, readFile)).toBe(result);
  });

  test('Сравнение YAML файлов', () => {
    const filepath1 = '/file1.yml';
    const filepath2 = '/file2.yml';

    expect(gendiff(filepath1, filepath2, format, readFile)).toBe(result);
  });
});
