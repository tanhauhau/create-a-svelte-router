<script>
  import { onMount } from 'svelte';
  export let shopId;
  export let itemId;
</script>

<h1>Haha {shopId} {itemId} {JSON.stringify($$props)}</h1>

<a href="/item/007/007">James Bond</a>
<a href="/item/asdf/007">asdf</a>
