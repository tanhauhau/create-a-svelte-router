import { match as int } from './params/int';
import { match as integer } from './params/integer';
import { createRouting } from './lib/routing';
createRouting({
  routes: [
    {
      url: /^\/a(?:|\/(.+))\/?$/,
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
      url: /^\/a\/b\/?$/,
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/a/b.svelte'),
      ],
    },
    {
      url: /^\/b\/?$/,
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/b.svelte'),
      ],
    },
    {
      url: /^\/c\/?$/,
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/c.svelte'),
      ],
    },
    {
      url: /^\/\/?$/,
      params: [],
      components: [
        () => import('./$/__layout.svelte'),
        () => import('./$/index.svelte'),
      ],
    },
    {
      url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
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
        () => import('./$/item/[shopId]/[itemId].svelte'),
      ],
    },
    {
      url: /^\/shop\/([^/]+)\/?$/,
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
  ],
  target: document.getElementById('app'),
});
