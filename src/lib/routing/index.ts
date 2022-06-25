// routing library

import type { SvelteComponent } from 'svelte';
const NotFound = () => import('./NotFound.svelte');

interface Route {
  url: string;
  component: () => Promise<SvelteComponent>;
}

export function createRouting({
  routes,
  target,
}: {
  routes: Route[];
  target: HTMLElement;
}) {
  function matchRoute(pathname) {
    if (currentComponent) {
      currentComponent.$destroy();
    }
    const matchedRoute = routes.find((route) => {
      return route.url === pathname;
    });
    const matchedComponentPromise = matchedRoute?.component ?? NotFound;

    matchedComponentPromise().then(({ default: matchedComponent }) => {
      currentComponent = new matchedComponent({
        target,
      });
    })
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
