import { createRouting } from './lib/routing';

createRouting({
  routes: [
    {
      url: /^\/\/?$/,
      params: [],
      components: [() => import('./routes/A.svelte')],
    },
    {
      url: /^\/b\/?$/,
      params: [],
      components: [() => import('./routes/B.svelte')],
    },
    {
      url: /^\/c\/?$/,
      params: [],
      components: [() => import('./routes/C.svelte')],
    },
    {
      // /shop/1-2
      // /shop/[year]-[month]
      // /shop/[shopId].svelte
      url: /^\/shop\/([^/]+)\/?$/,
      params: [{ name: 'shopId' }],
      components: [
        () => import('./routes/Layout.svelte'),
        () => import('./routes/Shop.svelte'),
      ],
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
      components: [
        () => import('./routes/Layout.svelte'),
        () => import('./routes/Item.svelte'),
      ],
    },
    // TODO: will do params matching later
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
      params: [{ name: 'shopId' }, { name: 'itemId' }],
      components: [() => import('./routes/Haha.svelte')],
    },
    {
      url: /^\/a(?:\/?|\/(.+)\/?)$/,
      params: [
        {
          name: 'rest',
          rest: true,
        },
      ],
      components: [() => import('./routes/Rest.svelte')],
    },
  ],
  target: document.getElementById('app'),
});
