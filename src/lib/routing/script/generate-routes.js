import fs from 'fs';
import path from 'path';

const cwd = process.cwd();

const outputFilePath = path.join(cwd, 'src/generated.ts');
const inputFolder = path.join(cwd, 'src/$');

console.log(fs.readdirSync(inputFolder));

fs.writeFileSync(outputFilePath, `
import { createRouting } from './lib/routing';
createRouting({
  routes: [
  ]
});
`, 'utf8');
