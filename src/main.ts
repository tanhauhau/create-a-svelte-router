import { createRouting } from './lib/routing';

createRouting({
  routes: [
    {
      url: /^\/\/?$/,
      params: [],
      component: () => import('./routes/A.svelte'),
    },
    {
      url: /^\/b\/?$/,
      params: [],
      component: () => import('./routes/B.svelte'),
    },
    {
      url: /^\/c\/?$/,
      params: [],
      component: () => import('./routes/C.svelte'),
    },
    {
      url: /^\/shop\/([^/]+)\/?$/,
      params: [{ name: 'shopId' }],
      component: () => import('./routes/Shop.svelte'),
    },
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
      params: [
        {
          name: 'shopId',
          matching: (shopId) => /^\d+$/.test(shopId),
        },
        {
          name: 'itemId',
          matching: (itemId) => /^\d+$/.test(itemId),
        },
      ],
      component: () => import('./routes/Item.svelte'),
    },
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
      params: [{ name: 'shopId' }, { name: 'itemId' }],
      component: () => import('./routes/Haha.svelte'),
    },
    {
      url: /^\/a(?:\/?|\/(.+)\/?)$/,
      params: [
        {
          name: 'rest',
          rest: true,
        },
      ],
      component: () => import('./routes/Rest.svelte'),
    },
  ],
  target: document.getElementById('app'),
});
