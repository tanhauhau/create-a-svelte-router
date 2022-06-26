import fs from 'fs';
import path from 'path';

// TODO:
// - [ ] generates route definition
// - [ ] handle layout

const cwd = process.cwd();

const outputFilePath = path.join(cwd, 'src/generated.ts');
const inputFolder = path.join(cwd, 'src/$');

const routes = exploreFolders(inputFolder);
console.log({ routes });

fs.writeFileSync(
  outputFilePath,
  `
import { createRouting } from './lib/routing';
createRouting({
  routes: [
    ${routes.map(({ componentPath, relativePath, layouts }) => {
      const component = relativePath.replace(/\.svelte$/, '');
      const segments = component.split('/');
      console.log(segments);
      if (segments[segments.length - 1] === 'index') {
        segments[segments.length - 1] = '';
      }
      ;
      const regExp = `/^\\/${segments.join('\\/')}\\/?$/`;
      return `{
        url: ${regExp},
        params: [],
        components: [
          () => import('./$/${relativePath}')
        ]
      }`;
    }).join(',\n')}
  ],
  target: document.getElementById('app'),
});
`,
  'utf8'
);

function exploreFolders(rootRouteDirectory) {
  function _explore(folderPath) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const isDirectory = fs.statSync(filePath).isDirectory();

      if (isDirectory) {
        _explore(filePath);
      } else {
        routes.push({
          componentPath: filePath,
          relativePath: path.relative(rootRouteDirectory, filePath),
          layouts: [],
        });
      }
    }
  }
  const routes = [];
  _explore(rootRouteDirectory);
  return routes;
}
