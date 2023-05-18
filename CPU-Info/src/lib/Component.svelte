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
			event.detail.forEach((element, index) => {
				let tmp_speed = [];

				if (data[index]?.clock_speed != undefined)
					tmp_speed = data[index].clock_speed;

				if (tmp_speed.length >= 10) tmp_speed.shift();

				tmp_speed.push([Date.now(), element.clock_speed]);

				data[index] = {
					...element,
					clock_speed: tmp_speed,
				};
			});
		});

		window.dispatchEvent(
			new CustomEvent("SUB2SOCKET", {
				detail: "CPU.CpuInfo",
			})
		);
	});

	let data = [
		{
			id: 0,
			core_id: 0,
			socket_id: 0,
			model_name: "Processor1",
			clock_speed: undefined,
			cache_size: 0,
			flags: "flag_1 flag_2",
		},
	];
</script>

<div bind:this={elem} class="flex flex-wrap gap-4">
	{#each data as cpu}
		<CpuCard {...cpu} />
	{/each}
</div>
