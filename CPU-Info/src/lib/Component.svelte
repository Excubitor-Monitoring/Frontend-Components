<svelte:options tag="cpu-info" />

<script>
	import css from "./Component.css";
	import { onMount } from "svelte/internal";
	let elem;
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

	import CpuCard from "./CpuCard.svelte";

	onMount(() => {
		setStyle();

		window.addEventListener("CPU.CpuInfo", (event) => {
			const time = Date.now();
			event.detail.forEach((element, index) => {
				data[index] = {
					...element,
					clock_speed: {x: time, y: element.clock_speed}
				};
			});
		});

		window.dispatchEvent(
			new CustomEvent("SUB2SOCKET", {
				detail: "CPU.CpuInfo",
			})
		);
	});

	$: data = [];
</script>

<div bind:this={elem} class="flex flex-wrap gap-4 w-full min-h-full justify-evenly items-center">
	{#each data as cpu}
		<CpuCard {...cpu} />
	{/each}
</div>
