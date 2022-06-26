<script>
  import { onMount } from 'svelte';
  export let shopId;
  export let itemId;

  let timer = 0;
  onMount(() => {
    const intervalId = setInterval(() => {
      timer++;
    }, 1000);
    return () => clearInterval(intervalId);
  });
</script>

<h1>Item {shopId} {itemId} {JSON.stringify($$props)}</h1>

{timer}

<a href="/item/007/007">James Bond</a>
