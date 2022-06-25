import { createRouting } from './lib/routing';
import A from './routes/A.svelte';
import B from './routes/B.svelte';
import C from './routes/C.svelte';

createRouting({
  routes: [
    { url: '/', component: A },
    { url: '/b', component: B },
    { url: '/c', component: C },
  ],
  target: document.getElementById('app')
});
