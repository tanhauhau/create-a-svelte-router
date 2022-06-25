<script>
  import { tweened } from 'svelte/motion';

  let visible = false;
  let hiding = false;

  let percentage = tweened(0, {
    duration: 500,
  });

  export async function show() {
    visible = true;
    percentage.set(0, { duration: 0 });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!visible || hiding) return;

    incrementLoadMore();
  }

  async function incrementLoadMore() {
    if (!visible || $percentage >= 100) return;
    if ($percentage === 0) {
      await percentage.set(50);
    } else if ($percentage < 80) {
      await percentage.set($percentage + 1);
    } else {
      await percentage.set($percentage + 0.1);
    }
    incrementLoadMore();
  }

  export async function hide() {
    hiding = true;
    if ($percentage > 0) {
      await percentage.set(100, { duration: 200 });
    }
    visible = false;
    hiding = false;
  }
</script>

{#if visible}
  <div style:transform="scaleX({$percentage}%)" />
{/if}

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    height: 5px;
    width: 100vw;
    background-color: rebeccapurple;
    transform-origin: 0 0;
  }
</style>
