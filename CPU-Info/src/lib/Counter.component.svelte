<svelte:options tag="counter-test" />

<script>
  import css from './Counter.css';
  import Badge from './Badge.svelte';
  import { onMount } from 'svelte/internal';
  export let message = 'None';
  let count= 0;
  const increment = () => {
    count += 1;
  };

  let elem;
  onMount(() => setStyle());

  export const setStyle = () => {
    // inject css in shadow root manually (we done using <style>, Svelte removes unsed css selectors)
    const root = elem?.getRootNode();
    if (root) {
      root.querySelectorAll('style').forEach((style) => root.removeChild(style));
      const style = document.createElement('style');
      style.appendChild(document.createTextNode(css));
      root.appendChild(style);
    }
  };
</script>

<button bind:this={elem} on:click={increment}>
  count = {count}
</button>
<Badge {message} />
