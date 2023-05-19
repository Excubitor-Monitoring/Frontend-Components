<svelte:options tag="cpu-info" />

<script>
	import css from "./Component.css";
	import { onMount } from "svelte/internal";
	export const setStyle = () => {
		// inject css in shadow root manually (we done using <style>, Svelte removes unsed css selectors)
		console.log(elem);
		const root = elem?.getRootNode();
		console.log(root);
		if (root) {
			root.querySelectorAll("style").forEach((style) =>
				root.removeChild(style)
			);
			const style = document.createElement("style");
			style.appendChild(document.createTextNode(css));
			root.appendChild(style);
		}
	};
	let elem;

	onMount(() => {
		setStyle()
	
	
	});

	import Badge from "./Badge.svelte";
	export let message = "None";
	let count = 0;
	const increment = () => {
		count += 1;
	};

	

	
</script>

<button bind:this={elem} on:click={increment} class="bg-red-600">
	count = {count}
</button>
<Badge {message} />
