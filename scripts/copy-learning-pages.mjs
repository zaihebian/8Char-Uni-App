import {cpSync, existsSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';

const output = join(process.cwd(), 'dist', 'build', 'h5');
const source = join(process.cwd(), 'public', 'learn');

if (!existsSync(output) || !existsSync(source)) {
  throw new Error('H5 build output or learning pages are missing.');
}

mkdirSync(join(output, 'learn'), {recursive: true});
cpSync(source, join(output, 'learn'), {recursive: true});
cpSync(join(process.cwd(), 'public', 'robots.txt'), join(output, 'robots.txt'));
console.log('Copied learning pages and robots.txt into H5 output.');
