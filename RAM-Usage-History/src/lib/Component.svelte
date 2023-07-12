<svelte:options tag="ram-usage-history" />

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
    import { setDate } from "date-fns";
	import Modal from "./Modal.svelte";

	const tzoffset = (new Date()).getTimezoneOffset() * 60000;

	let canvas;
	let chart;

	let from_date;
	let to_date;
	let density;
	let preset;
	let show_modal = false;

	$: density_time = 10**density;
	$: noValues = Math.ceil(((new Date(to_date)).valueOf() - (new Date(from_date)).valueOf()) / density_time);


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
					target: "Memory.MemInfo",
					value: JSON.stringify({
						From: new Date(from_date).toISOString(),
						Until: new Date(to_date).toISOString(),
						max_density: Math.floor(10**density).toString() + "ms",
					}),
				},
			})
		);

		console.log(new Date(from_date));
		console.log(new Date(to_date));

	}

	function setTime(template) {
		to_date = (new Date(Date.now()  - tzoffset)).toISOString().slice(0,16)
		switch (template) {
			case "10min":
				from_date = (new Date(Date.now() - (10*60*1000)  - tzoffset)).toISOString().slice(0,16)
				density = Math.log10(30 * 1000)
				break;
			case "1h":
				from_date = (new Date(Date.now() - (60*60*1000) - tzoffset)).toISOString().slice(0,16)
				density = Math.log10(5* 60 * 1000)
				break;
			case "1D":
				from_date = (new Date(Date.now() - (24*60*60*1000) - tzoffset)).toISOString().slice(0,16)
				density = Math.log10(2 * 60 * 60 * 1000)
				break;
			case "1W":
				from_date = (new Date(Date.now() - (7*24*60*60*1000) - tzoffset)).toISOString().slice(0,16)
				density = Math.log10(12 * 60 * 60 * 1000)
				break;
			case "1M":
				from_date = (new Date(Date.now() - (30*24*60*60*1000) - tzoffset)).toISOString().slice(0,16)
				density = Math.log10(2 * 24 * 60 * 60 * 1000)
				break;
		}

		getData();

	}

	function setCustom(){
		preset = "custom";
		if(noValues > 100) show_modal = true;
		else getData();
	}

	function getTime(ms_time){

		if(ms_time >= 86400000)return (ms_time / (24 * 60 * 60 * 1000)).toFixed(2) + " d"
		else if(ms_time >= 3600000) return (ms_time / (60 * 60 * 1000)).toFixed(2) + " h"
		else if(ms_time >= 60000) return (ms_time / (60 * 1000)).toFixed(2) + " min"
		else if(ms_time >= 1000) return (ms_time / (1000)).toFixed(2) + " s"
		else return ms_time.toFixed(2) + " ms"
		getData();
	}

	let usage = {};

	onMount(() => {
		setStyle();

		window.addEventListener("Memory.MemInfo", (event) => {
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

			console.log(event_data);

			let chart_data = Object.keys(event_data[0].message.value).map((item) => {
				return {
					label: item,
					data: [],
				};
			});

			console.log("CHARTDATA", chart_data);

			event_data.forEach(time_element => {
				Object.entries(time_element.message.value).forEach(ram_item => {
					console.log("RAMITEM", ram_item);
					const data_item = chart_data.find(chart_data_item => chart_data_item.label == ram_item[0])
					data_item.data.push({x: time_element.timestamp ,y: ram_item[1]})
				})
			})

			chart.data.datasets = chart_data;

			chart.update();
		});

		setTime("10min");

		const options = {
			type: "line",
			data: {
				datasets: [],
			},
			options: {
				scales: {
					x: {
						type: "time",
						ticks: {
							source: 'data'
						}
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
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>From: </label>
					<input type="datetime-local" bind:value={from_date} on:change={setCustom}>
				</div>
				<div>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>To: </label>
					<input type="datetime-local" bind:value={to_date} on:change={setCustom}>
				</div>
			</div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>Density ({getTime(density_time)}): </label>
			<input type="range" min="1" max="9" step="any" bind:value={density} on:change={setCustom}>
		</div>
		
		<select class=" p-2 rounded" bind:value={preset} on:change={() => setTime(preset)}>
			<option value="10min">10min.</option>
			<option value="1h">1h</option>
			<option value="1D">1D</option>
			<option value="1W">1W</option>
			<option value="1M">1M</option>
			<option value="custom">custom</option>
		</select>
	</div>

	<canvas bind:this={canvas} />
</div>

{#if show_modal}
	<Modal callback={getData} values={noValues} closeModal={() => show_modal = false}/>
{/if}