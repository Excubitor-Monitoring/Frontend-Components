<svelte:options tag="filesystem-usage" />

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

	import Chart from "chart.js/auto";
	import 'chartjs-adapter-date-fns';

	let canvas;
	let chart;

	let usage = [
		{
			name: "fs-01",
			size: "998523904",
			partitions: []
		},
		{
			name: "fs-02",
			size: "1000204632",
			partitions: [
				{
					name: 
				}
			]
		}
	];

	onMount(() => {
		setStyle();

		window.addEventListener("Memory.SwapInfo", (event) => {
			let time = Date.now();
			
			Object.entries(event.detail).forEach((element, index) => {
				if (chart.data.datasets[index] == undefined) chart.data.datasets[index] = {label: element[0], data: []}
				else if (chart.data.datasets[index].data.length >= 10) chart.data.datasets[index].data.shift()
				chart.data.datasets[index].data.push({x: time, y: element[1]})
			});

			chart.update();
		});

		window.dispatchEvent(
			new CustomEvent("SUB2SOCKET", {
				detail: "Memory.SwapInfo",
			})
		);

		const options = {
			type: "line",
			data: {
				datasets: [],
			},
			options: {
				scales: {
					x: {
						type: "time",
					},
				},
			},
		};

		chart = new Chart(canvas, options);
	});
</script>

<div bind:this={elem} class="flex justify-center items-center min-w-full min-h-full">
	<canvas bind:this={canvas} />
</div>