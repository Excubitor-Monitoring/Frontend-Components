<svelte:options tag="cpu-usage" />

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

	let usage = {};

	onMount(() => {
		setStyle();

		window.addEventListener("CPU.Usage", (event) => {
			let time = Date.now();
			console.log(chart.data.datasets);
			console.log(event.detail);

			
			Object.entries(event.detail).forEach((element, index) => {
				if (chart.data.datasets[index] == undefined) chart.data.datasets[index] = {label: element[0], data: []}
				else if (chart.data.datasets[index].data.length >= 10) chart.data.datasets[index].data.shift()
				chart.data.datasets[index].data.push({x: time, y: element[1].usage})
			});

			chart.update();
		});

		window.dispatchEvent(
			new CustomEvent("SUB2SOCKET", {
				detail: "CPU.Usage",
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