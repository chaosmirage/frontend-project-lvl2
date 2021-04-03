/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), { encoding: 'utf8' });

export default readFile;
