
import { createRouting } from './lib/routing';
createRouting({
  routes: [
    {
        url: /^\/a\/[...rest]\/?$/,
        params: [],
        components: [
          () => import('./$/a/[...rest].svelte')
        ]
      },
{
        url: /^\/b\/?$/,
        params: [],
        components: [
          () => import('./$/b.svelte')
        ]
      },
{
        url: /^\/c\/?$/,
        params: [],
        components: [
          () => import('./$/c.svelte')
        ]
      },
{
        url: /^\/\/?$/,
        params: [],
        components: [
          () => import('./$/index.svelte')
        ]
      },
{
        url: /^\/item\/[shopId]\/[itemId]\/?$/,
        params: [],
        components: [
          () => import('./$/item/[shopId]/[itemId].svelte')
        ]
      },
{
        url: /^\/item\/__layout\/?$/,
        params: [],
        components: [
          () => import('./$/item/__layout.svelte')
        ]
      },
{
        url: /^\/shop\/[shopId]\/?$/,
        params: [],
        components: [
          () => import('./$/shop/[shopId].svelte')
        ]
      },
{
        url: /^\/shop\/__layout\/?$/,
        params: [],
        components: [
          () => import('./$/shop/__layout.svelte')
        ]
      }
  ],
  target: document.getElementById('app'),
});
