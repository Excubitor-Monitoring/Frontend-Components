<svelte:options tag="cpu-usage-history" />

<script>
	import css from "./Component.css";
	import { current_component, onMount } from "svelte/internal";
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

	import Chart from "chart.js/auto";
	import "chartjs-adapter-date-fns";

	let canvas;
	let chart;

	let from_date;
	let to_date;
	let density;
	let preset;

	function printdata() {
		console.log("From: ", from_date);
		console.log("To: ", to_date);
		console.log("Density: ", density);
		console.log("Preset: ", preset);
	}

	function getData() {

		window.dispatchEvent(
			new CustomEvent("HIST2SOCKET", {
				detail: {
					target: "CPU.Usage",
					value: JSON.stringify({
						From: new Date(Date.now() - 1000 * 60).toISOString(),
						Until: new Date().toISOString(),
						MaxDensity: "1000",
					}),
				},
			})
		);

	}

	let usage = {};

	onMount(() => {
		setStyle();

		window.addEventListener("CPU.Usage", (event) => {
			let time = Date.now();

			let event_data = event.detail.map((obj) => {
				return {
					timestamp: obj.timestamp,
					message: {
						target: obj.message.target,
						value: JSON.parse(obj.message.value),
					},
				};
			});

			let chart_data = Object.keys(event_data[0].message.value).map((item) => {
				return {
					label: item,
					data: [],
				};
			});

			event_data.forEach(time_element => {
				Object.entries(time_element.message.value).forEach(cpu_item => {
					const data_item = chart_data.find(chart_data_item => chart_data_item.label == cpu_item[0])
					data_item.data.push({x: time_element.timestamp ,y: cpu_item[1].usage})
				})
			})

			console.log(chart_data);

			/*
			Object.entries(event.detail).forEach((element, index) => {
				if (chart.data.datasets[index] == undefined) chart.data.datasets[index] = {label: element[0], data: []}
				else if (chart.data.datasets[index].data.length >= 10) chart.data.datasets[index].data.shift()
				chart.data.datasets[index].data.push({x: time, y: element[1].usage})
			});
			*/

			chart.data.datasets = chart_data;

			chart.update();
		});

		getData();

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

<div
	bind:this={elem}
	class=" flex justify-center items-center min-w-full min-h-full flex-col gap-10"
>

	<div class="flex flex-row justify-center gap-10 items-center min-w-full">
		<div class="flex flex-col gap-2">
			<div class=" flex flex-row gap-5">
				<div>
					<label>From: </label>
					<input type="datetime-local" bind:value={from_date} on:change={printdata}>
				</div>
				<div>
					<label>To: </label>
					<input type="datetime-local" bind:value={to_date} on:change={printdata}>
				</div>
			</div>
			<label>Density (): </label>
			<input type="range" bind:value={density} on:change={printdata}>
		</div>
		
		<select bind:value={preset} on:change={printdata}>
			<option value="10min">10min.</option>
			<option value="1h">1h</option>
			<option value="1d">1d</option>
			<option value="1w">1w</option>
			<option value="1m">1m</option>
			<option value="custom">custom</option>
		</select>
	</div>

	<canvas bind:this={canvas} />
</div>
