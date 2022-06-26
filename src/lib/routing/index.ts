// routing library

import type { SvelteComponent } from 'svelte';
import LoadingIndicator from './LoadingIndicator.svelte';
import Main from './Main.svelte';
const NotFound = [() => import('./NotFound.svelte')];

interface Route {
  url: RegExp;
  params: Array<{
    name: string;
    matching?: (param: string) => boolean;
    rest?: boolean;
  }>;
  components: Array<() => Promise<SvelteComponent>>;
}

export function createRouting({
  routes,
  target,
}: {
  routes: Route[];
  target: HTMLElement;
}) {
  let main;

  function matchRoute(pathname: string) {
    let matchedRouteParams;
    let matchedRoute;

    route_matching: for (const route of routes) {
      const match = pathname.match(route.url);
      if (match) {
        const params = {};
        for (let i = 0; i < route.params.length; i++) {
          const {
            name: paramName,
            matching: paramMatchingFn,
            rest: paramIsRest,
          } = route.params[i];
          const paramValue = match[i + 1] ?? '';

          if (typeof paramMatchingFn === 'function') {
            if (!paramMatchingFn(paramValue)) {
              continue route_matching;
            }
          }

          params[paramName] = paramIsRest ? toArray(paramValue) : paramValue;
        }

        matchedRoute = route;
        matchedRouteParams = params;
        break;
      }
    }

    const matchedComponentsPromises = matchedRoute?.components ?? NotFound;
    showLoadingIndicator();

    Promise.all(
      matchedComponentsPromises.map(fn => fn())
    ).then(matchedComponentModules => {
      hideLoadingIndicator();
      const matchedComponents = matchedComponentModules.map(module => module.default);
      if (!main) {
        main = new Main({
          props: {
            matchedComponents,
            matchedRouteParams,
          },
          target,
        });
      } else {
        main.$set({
          matchedComponents,
          matchedRouteParams,
        });
      }
    })
  }

  const indicator = new LoadingIndicator({
    target: document.body,
  });

  function showLoadingIndicator() {
    indicator.show();
  }
  function hideLoadingIndicator() {
    indicator.hide();
  }

  matchRoute(window.location.pathname);

  window.addEventListener('click', function (event) {
    const clickTarget = event.target;
    const anchorTag = findAnchorTag(clickTarget as HTMLElement);
    if (!anchorTag) return;
    if (anchorTag.target) return;
    if (anchorTag.hasAttribute('no-routing')) return;
    event.preventDefault();
    const targetLocation = anchorTag.href;
    const targetPathname = new URL(targetLocation).pathname;

    // 1. update the URL without navigating
    history.pushState({}, undefined, targetPathname);

    // 2. match the component and render a content
    matchRoute(targetPathname);
  });
  window.addEventListener('popstate', function () {
    matchRoute(window.location.pathname);
  });
}

function findAnchorTag(element: HTMLElement) {
  if (element.tagName === 'HTML') return null;
  if (element.tagName === 'A') return element;
  else return findAnchorTag(element.parentElement);
}

function toArray(paramValue: string) {
  if (paramValue[paramValue.length - 1] === '/') {
    paramValue = paramValue.slice(0, -1);
  }
  return paramValue === '' ? [] : paramValue.split('/')
}