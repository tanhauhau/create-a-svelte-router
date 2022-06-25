import { createRouting } from './lib/routing';

createRouting({
  routes: [
    { url: '/', component: () => import('./routes/A.svelte') },
    { url: '/b', component: () => import('./routes/B.svelte') },
    { url: '/c', component: () => import('./routes/C.svelte') },
  ],
  target: document.getElementById('app')
});
