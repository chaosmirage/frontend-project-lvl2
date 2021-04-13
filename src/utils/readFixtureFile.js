/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (filename) => path.join(__dirname, '..', '..', '__fixtures__', filename);
