<script>
  let showMoreLinks = true;
</script>

<h1>A</h1>

<input type="checkbox" bind:checked={showMoreLinks} />

{#if showMoreLinks}
  <a href="/b">Go to <span>aaa</span> B</a>
  <a href="/b" target="_blank">Go to B</a>
  <a href="/b" no-routing>Go to B</a>
  <a href="/c">Go to C</a>
{/if}
