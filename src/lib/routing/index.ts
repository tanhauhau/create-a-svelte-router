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
  const pathname = window.location.pathname;
  const matchedRoute = routes.find(route => {
    return route.url === pathname;
  })

  const matchedComponent = matchedRoute?.component ?? NotFound;
  new matchedComponent({
    target,
  });
}
