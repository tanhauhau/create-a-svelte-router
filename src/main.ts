import { createRouting } from './lib/routing';

createRouting({
  routes: [
    {
      url: /^\/\/?$/,
      params: [],
      paramsMatching: [],
      component: () => import('./routes/A.svelte'),
    },
    {
      url: /^\/b\/?$/,
      params: [],
      paramsMatching: [],
      component: () => import('./routes/B.svelte'),
    },
    {
      url: /^\/c\/?$/,
      params: [],
      paramsMatching: [],
      component: () => import('./routes/C.svelte'),
    },
    {
      url: /^\/shop\/([^/]+)\/?$/,
      params: ['shopId'],
      paramsMatching: [],
      component: () => import('./routes/Shop.svelte'),
    },
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
      params: ['shopId', 'itemId'],
      paramsMatching: [
        (shopId) => /^\d+$/.test(shopId),
        (itemId) => /^\d+$/.test(itemId),
      ],
      component: () => import('./routes/Item.svelte'),
    },
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
      params: ['shopId', 'itemId'],
      paramsMatching: [],
      component: () => import('./routes/Haha.svelte'),
    },
  ],
  target: document.getElementById('app'),
});
