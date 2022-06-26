<script>
  export let matchedComponents = [];
  export let matchedRouteParams = {};
</script>

{#if matchedComponents.length === 1}
  <svelte:component this={matchedComponents[0]} {...matchedRouteParams} />
{:else if matchedComponents.length > 1}
  <svelte:component this={matchedComponents[0]} {...matchedRouteParams}>
    <svelte:self
      matchedComponents={matchedComponents.slice(1)}
      {matchedRouteParams}
    />
  </svelte:component>
{/if}
