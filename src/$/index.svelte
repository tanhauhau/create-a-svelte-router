<script>
  let showMoreLinks = true;
</script>

<h1>A</h1>

<input type="checkbox" bind:checked={showMoreLinks} />

<a href="/b">Go to <span>aaa</span> B</a>
{#if showMoreLinks}
  <a href="/c">Go to C</a>
{/if}
