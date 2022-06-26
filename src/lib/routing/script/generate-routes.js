import fs from 'fs';
import path from 'path';

const cwd = process.cwd();

const outputFilePath = path.join(cwd, 'src/generated.ts');
const inputFolder = path.join(cwd, 'src/$');
const paramsFolder = path.join(cwd, 'src/params');

const LAYOUT_REGEX = /^__layout(?:-([^@]+)?)?(?:@(.+))?\.svelte$/;

export function initWatcher(watcher) {
  function onChange(path) {
    if (path.startsWith(inputFolder)) {
      generateRoutesDefinition();
    }
  }
  watcher.on('add', onChange).on('unlink', onChange);

  generateRoutesDefinition();
}

export function generateRoutesDefinition() {
  const routes = exploreFolders(inputFolder);
  const allMatches = new Set();
  routes.forEach((route) =>
    route.matches.forEach((match) => allMatches.add(match))
  );

  fs.writeFileSync(
    outputFilePath,
    `${Array.from(allMatches)
      .map((match) => `import { match as ${match} } from './params/${match}';`)
      .join('\n')}
  import { createRouting } from './lib/routing';
  createRouting({
    routes: [
      ${routes
        .map(({ componentPath, relativePath, components, regex, params }) => {
          return `{
          url: ${regex},
          routeId: ${JSON.stringify(relativePath.replace(/\.svelte$/, ''))},
          params: [
            ${params
              .map(
                ({ name, rest, match }) =>
                  `{
                    name: ${JSON.stringify(name)},
                    rest: ${rest ? 'true' : 'false'},
                    matching: ${match},
                   }`
              )
              .join(',\n')}
          ],
          components: [
            ${components
              .map((relativePath) => `() => import('./$/${relativePath}')`)
              .join(',')}
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
}

function getRegExpAndParams(relativePath) {
  const component = relativePath.replace(/(@.+)?\.svelte$/, '');
  const segments = component.split('/');
  const parts = [];
  const length = segments.length;

  const params = [];
  let regexSegments = '';
  const matches = [];

  for (let i = 0; i < length; i++) {
    let segment = segments[i];
    const part = { segment };
    parts.push(part);
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
          let match;
          if (paramName.indexOf('=') > -1) {
            [paramName, match] = paramName.split('=');

            if (!fs.existsSync(path.join(paramsFolder, match + '.ts'))) {
              throw new Error(
                `Invalid path ${relativePath}, unknown matching function: "${match}"`
              );
            }

            matches.push(match);
          }
          params.push({
            name: paramName,
            match,
            rest,
          });
          if (rest) {
            regexStr += '(?:|\\/(.+))';
          } else {
            regexStr += '([^/]+)';
          }
          part.dynamic = true;
          if (rest) part.rest = true;
          if (match) part.match = true;
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

      segment = rest ? regexStr : '\\/' + regexStr;
    } else {
      segment = '\\/' + segment;
    }

    regexSegments += segment;
  }

  return {
    regex: `/^${regexSegments}\\/?$/`,
    params,
    matches,
    parts,
  };
}

function exploreFolders(rootRouteDirectory) {
  function _explore(folderPath) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      const relativePath = path.relative(rootRouteDirectory, filePath);

      if (isDirectory) {
        _explore(filePath);
      } else if (LAYOUT_REGEX.test(file)) {
        const match = file.match(LAYOUT_REGEX);
        const layoutName = match[1] ?? 'default';
        const inheritsLayout = match[2] ?? 'default';
        const key = relativePath.replace('@' + inheritsLayout, '');
        layouts[key] = {
          componentPath: filePath,
          relativePath,
          layoutName,
          inheritsLayout,
        };
      } else {
        const match = file.match(/^.+?(?:@(.+))?\.svelte$/);
        const inheritsLayout = match[1] ?? 'default';
        routes.push({
          componentPath: filePath,
          relativePath,
          components: [relativePath],
          inheritsLayout,
        });
      }
    }
  }
  const routes = [];
  const layouts = {};
  _explore(rootRouteDirectory);

  // applying layouts
  for (const route of routes) {
    let dirname = path.dirname(route.relativePath);
    let inheritsLayout = route.inheritsLayout;
    while (true) {
      let layoutCandidate =
        dirname === '.' ? '__layout' : dirname + '/__layout';
      if (inheritsLayout !== 'default') layoutCandidate += '-' + inheritsLayout;
      layoutCandidate += '.svelte';
      const layout = layouts[layoutCandidate];
      let shouldGoUpALevel = false;
      if (layout) {
        route.components.unshift(layout.relativePath);
        shouldGoUpALevel = inheritsLayout === layout.inheritsLayout;
        inheritsLayout = layout.inheritsLayout;
      } else {
        shouldGoUpALevel = true;
      }

      if (shouldGoUpALevel) {
        if (dirname === '.') break;
        dirname = path.dirname(dirname);
      }
    }
  }

  // extract regex and params
  for (const route of routes) {
    const { regex, params, matches, parts } = getRegExpAndParams(
      route.relativePath
    );
    route.regex = regex;
    route.params = params;
    route.matches = matches;
    route.parts = parts;
  }

  routes.sort((routeA, routeB) => {
    const partsA = routeA.parts;
    const partsB = routeB.parts;
    if (partsA.length !== partsB.length) {
      return partsA.length < partsB.length ? 1 : -1;
      // /a/[a]/[b] -> 3
      // /a/[...rest] -> 2
    }

    for (let i = 0; i < partsA.length; i++) {
      const partA = partsA[i];
      const partB = partsB[i];

      if (partA.dynamic !== partB.dynamic) {
        return partA.dynamic ? 1 : -1;
      }
      if (partA.match !== partB.match) {
        return partA.match ? -1 : 1;
      }
      if (partA.rest !== partB.rest) {
        return partA.rest ? 1 : -1;
      }
    }

    return routeA.relativePath < routeB.relativePath ? -1 : 1;
    // // `/a/[b]` < `/[a]/b`
    // //
    // // a > b
    // return 1;
    // // a < b
    // return -1;
    // // a === b
    // return 0;
  });

  return routes;
}
