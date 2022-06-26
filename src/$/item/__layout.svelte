<script>
  import { onMount } from 'svelte';
  let timer = 0;
  onMount(() => {
    const intervalId = setInterval(() => {
      timer++;
    }, 1000);
    return () => clearInterval(intervalId);
  });
</script>

<nav>This is the navigation bar {timer}</nav>

<div>
  <slot />
</div>

<footer>THIS IS THE FOOTER</footer>

<style>
  div {
    margin: 8px;
    border: 8px solid black;
  }
</style>