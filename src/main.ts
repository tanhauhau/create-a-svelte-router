import { createRouting } from './lib/routing';

createRouting({
  routes: [
    { url: /^\/$/, component: () => import('./routes/A.svelte') },
    { url: /^\/b$/, component: () => import('./routes/B.svelte') },
    { url: /^\/c$/, component: () => import('./routes/C.svelte') },
    { url: /^\/shop\/(.+)$/, params: ['shopId'], component: () => import('./routes/Shop.svelte') },
    { url: /^\/item\/(.+)\/(.+)$/, params: ['shopId', 'itemId'], component: () => import('./routes/Item.svelte') },
  ],
  target: document.getElementById('app')
});
