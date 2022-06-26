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
    ${routes
      .map(({ componentPath, relativePath, layouts }) => {
        const { regex, params } = getRegExpAndParams(relativePath);
        console.log(params);
        return `{
        url: ${regex},
        params: [
          ${params
            .map(
              ({ name, rest }) =>
                // TODO:
                `{ name: ${JSON.stringify(name)}, rest: ${
                  rest ? 'true' : 'false'
                } }`
            )
            .join(',\n')}
        ],
        components: [
          () => import('./$/${relativePath}')
        ]
      }`;
      })
      .join(',\n')}
  ],
  target: document.getElementById('app'),
});
`,
  'utf8'
);

function getRegExpAndParams(relativePath) {
  const component = relativePath.replace(/\.svelte$/, '');
  const segments = component.split('/');
  const length = segments.length;

  const params = [];
  const regexSegments = [];

  for (let i = 0; i < length; i++) {
    let segment = segments[i];
    if (i === length - 1 && segment === 'index') {
      segment = '';
    }
    if (segment.indexOf('[') > -1) {
      let isOpening = false;
      let paramName = '';
      let regexStr = '';
      let rest = false;
      // sanity checking
      // a[baaac
      //       ^
      // partname: 'a' + '([^/]+)'
      for (let index = 0; index < segment.length; index++) {
        const char = segment[index];
        if (char === '[') {
          if (isOpening) {
            throw new Error(
              `Invalid path ${relativePath}, encounter "[" after another "["`
            );
          }
          isOpening = true;
          if (
            segment[index + 1] === '.' &&
            segment[index + 2] === '.' &&
            segment[index + 3] === '.'
          ) {
            rest = true;
            index += 3;
          } else {
            rest = false;
          }
          paramName = '';
        } else if (char === ']') {
          if (!isOpening) {
            throw new Error(
              `Invalid path ${relativePath}, encounter "]" before any "["`
            );
          }
          if (paramName === '') {
            throw new Error(
              `Invalid path ${relativePath}, encounter "[]" without parameter name`
            );
          }
          params.push({
            name: paramName,
            rest,
          });
          if (rest) {
            regexStr += '(?:|\\/(.+))';
          } else {
            regexStr += '([^/]+)';
          }
          isOpening = false;
        } else {
          if (isOpening) {
            paramName += char;
          } else {
            regexStr += char;
          }
        }
      }

      if (isOpening) {
        throw new Error(`Invalid path ${relativePath}, unclosed "["`);
      }

      segment = regexStr;
    }

    regexSegments.push(segment);
  }

  return {
    regex: `/^\\/${regexSegments.join('\\/')}\\/?$/`,
    params,
  };
}

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
