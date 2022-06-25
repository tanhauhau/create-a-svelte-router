// routing library

import type { SvelteComponent } from 'svelte';
import NotFound from './NotFound.svelte';

interface Route {
  url: string;
  component: SvelteComponent;
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
    const matchedComponent = matchedRoute?.component ?? NotFound;
    currentComponent = new matchedComponent({
      target,
    });

    // TODO: clean up the a click event 
    document.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', function (event) {
        if (a.target) return;
        event.preventDefault();
        const targetLocation = a.href;
        const targetPathname = new URL(targetLocation).pathname;

        // 1. update the URL without navigating
        history.pushState({}, undefined, targetPathname);

        // 2. match the component and render a content
        matchRoute(targetPathname);
      });
    });
  }

  let currentComponent;
  matchRoute(window.location.pathname);
}
