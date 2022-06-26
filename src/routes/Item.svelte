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
<a href="/item/008/008">008</a>
<a href="/item/009/009">009</a>
<a href="/shop/123">to shop</a>
