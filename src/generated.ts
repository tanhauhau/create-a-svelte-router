import { match as int } from './params/int';
import { match as integer } from './params/integer';
import { createRouting } from './lib/routing';
createRouting({
  routes: [
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
      routeId: 'item/[shopId=int]/[itemId=integer]',
      params: [
        {
          name: 'shopId',
          rest: false,
          matching: int,
        },
        {
          name: 'itemId',
          rest: false,
          matching: integer,
        },
      ],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/item/__layout.svelte'),
        () => import('./$/item/[shopId=int]/__layout.svelte'),
        () => import('./$/item/[shopId=int]/[itemId=integer].svelte'),
      ],
    },
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
      routeId: 'item/[shopId]/[itemId]@foo',
      params: [
        {
          name: 'shopId',
          rest: false,
          matching: undefined,
        },
        {
          name: 'itemId',
          rest: false,
          matching: undefined,
        },
      ],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/item/__layout.svelte'),
        () => import('./$/item/[shopId]/__layout-root.svelte'),
        () => import('./$/item/[shopId]/__layout-foo@root.svelte'),
        () => import('./$/item/[shopId]/[itemId]@foo.svelte'),
      ],
    },
    {
      url: /^\/a\/b\/?$/,
      routeId: 'a/b',
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/a/b.svelte'),
      ],
    },
    {
      url: /^\/shop\/([^/]+)\/?$/,
      routeId: 'shop/[shopId]',
      params: [
        {
          name: 'shopId',
          rest: false,
          matching: undefined,
        },
      ],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/shop/__layout.svelte'),
        () => import('./$/shop/[shopId].svelte'),
      ],
    },
    {
      url: /^\/a(?:|\/(.+))\/?$/,
      routeId: 'a/[...rest]',
      params: [
        {
          name: 'rest',
          rest: true,
          matching: undefined,
        },
      ],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/a/[...rest].svelte'),
      ],
    },
    {
      url: /^\/b\/?$/,
      routeId: 'b',
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/b.svelte'),
      ],
    },
    {
      url: /^\/c\/?$/,
      routeId: 'c',
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/c.svelte'),
      ],
    },
    {
      url: /^\/\/?$/,
      routeId: 'index',
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/index.svelte'),
      ],
    },
  ],
  target: document.getElementById('app'),
});
