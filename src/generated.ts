
import { createRouting } from './lib/routing';
createRouting({
  routes: [
    {
        url: /^\/a\/(?:|\/(.+))\/?$/,
        params: [
          { name: "rest", rest: true }
        ],
        components: [
          () => import('./$/__layout.svelte'),() => import('./$/a/[...rest].svelte')
        ]
      },
{
        url: /^\/b\/?$/,
        params: [
          
        ],
        components: [
          () => import('./$/__layout.svelte'),() => import('./$/b.svelte')
        ]
      },
{
        url: /^\/c\/?$/,
        params: [
          
        ],
        components: [
          () => import('./$/__layout.svelte'),() => import('./$/c.svelte')
        ]
      },
{
        url: /^\/\/?$/,
        params: [
          
        ],
        components: [
          () => import('./$/__layout.svelte'),() => import('./$/index.svelte')
        ]
      },
{
        url: /^\/item\/([^/]+)\/([^/]+)\/?$/,
        params: [
          { name: "shopId", rest: false },
{ name: "itemId", rest: false }
        ],
        components: [
          () => import('./$/__layout.svelte'),() => import('./$/item/__layout.svelte'),() => import('./$/item/[shopId]/__layout.svelte'),() => import('./$/item/[shopId]/[itemId].svelte')
        ]
      },
{
        url: /^\/shop\/([^/]+)\/?$/,
        params: [
          { name: "shopId", rest: false }
        ],
        components: [
          () => import('./$/__layout.svelte'),() => import('./$/shop/__layout.svelte'),() => import('./$/shop/[shopId].svelte')
        ]
      }
  ],
  target: document.getElementById('app'),
});
