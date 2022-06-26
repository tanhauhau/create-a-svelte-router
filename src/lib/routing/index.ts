// routing library

import type { SvelteComponent } from 'svelte';
import LoadingIndicator from './LoadingIndicator.svelte';
const NotFound = () => import('./NotFound.svelte');

interface Route {
  url: RegExp;
  params: string[];
  component: () => Promise<SvelteComponent>;
}

export function createRouting({
  routes,
  target,
}: {
  routes: Route[];
  target: HTMLElement;
}) {
  function matchRoute(pathname: string) {
    let matchedRouteParams;
    let matchedRoute;

    for (const route of routes) {
      const match = pathname.match(route.url);
      if (match) {
        matchedRoute = route;
        const params = {};
        for (let i = 0; i < route.params.length; i++) {
          params[route.params[i]] = match[i + 1];
        }
        matchedRouteParams = params;
        break;
      }
    }

    const matchedComponentPromise = matchedRoute?.component ?? NotFound;
    showLoadingIndicator();
    matchedComponentPromise().then(({ default: matchedComponent }) => {
      hideLoadingIndicator();
      if (currentComponent) {
        currentComponent.$destroy();
      }
      currentComponent = new matchedComponent({
        props: matchedRouteParams,
        target,
      });
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

  let currentComponent;
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
