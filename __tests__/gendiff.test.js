import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import gendiff from '../src/index.js';
import getFixturePath from '../src/utils/readFixtureFile.js';

const readFile = (filename) => fs.readFileSync(getFixturePath(filename), { encoding: 'utf8' });

const formats = ['json', 'yml'];

const stylishResult = readFile('stylish-result.txt').trim();
const plainResult = readFile('plain-result.txt').trim();

describe('gendiff', () => {
  test.each(formats)('Сравнение %s файлов', (format) => {
    const filepath1 = getFixturePath(`file1.${format}`);
    const filepath2 = getFixturePath(`file2.${format}`);

    expect(gendiff(filepath1, filepath2, 'stylish')).toBe(stylishResult);
    expect(gendiff(filepath1, filepath2, 'plain')).toBe(plainResult);

    const jsonDiff = gendiff(filepath1, filepath2, 'json');

    expect(() => JSON.parse(jsonDiff)).not.toThrow();
  });
});
