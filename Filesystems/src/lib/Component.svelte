<svelte:options tag="filesystem-usage" />

<script>
	import css from "./Component.css";
	import { onMount } from "svelte/internal";
    import FsCard from "./FSCard.svelte";
	export const setStyle = () => {
		// inject css in shadow root manually (we done using <style>, Svelte removes unsed css selectors)
		const root = elem?.getRootNode();
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

	let filesystems = [];

	onMount(() => {
		setStyle();

		window.addEventListener("FS.Partitions", (event) => {

			filesystems = event.detail;

		});

		window.dispatchEvent(
			new CustomEvent("GET2SOCKET", {
				detail: "FS.Partitions",
			})
		);
	});
</script>

<div bind:this={elem} class="flex flex-wrap gap-4 w-full min-h-full justify-evenly items-center">
	{#each filesystems as filesystem}
		<FsCard fs={filesystem}/>
	{/each}
</div>