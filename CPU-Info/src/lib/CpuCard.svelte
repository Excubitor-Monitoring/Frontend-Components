<script>
    import {flag_codes} from "./flags"

    import Chart from "chart.js/auto";
	import 'chartjs-adapter-date-fns';
    import { onMount } from "svelte";

    onMount(() => {
        chart = new Chart(canvas, options);
    })

    export let id = 0;
    export let core_id = 0;
    export let socket_id = 0;
    export let model_name = "";
    export let clock_speed;
    export let cache_size = 0;
    export let flags = "";

    $: console.log(clock_speed);

    let hover = false;

	let tooltip = "\n";

    let chart;
    let canvas;

    $: flag_array = flags.toUpperCase().split(" ");

    $: {
        if (chart?.data.datasets[0].data.length > 10) chart?.data.datasets[0].data.shift()
        chart?.data.datasets[0].data.push(clock_speed)
        chart?.update();
    }

    const options = {
			type: "line",
			data: {
				datasets: [{label: "Clockspeed", data: []}],
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
</script>

<div
    class="card p-4 border border-solid border-black rounded-lg flex flex-col justify-center"
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
>
        <table class="text-left border-collapse divide-y-2 divide-solid" style={hover ? "" : "display: none"}>
            <tr class="py-2"
                ><th class="pr-4 whitespace-nowrap">ID</th><td>{id}</td></tr
            >
            <tr
                ><th class="py-2 py-2 pr-4 whitespace-nowrap">Core ID</th><td
                    >{core_id}</td
                ></tr
            >
            <tr
                ><th class="py-2 pr-4 whitespace-nowrap">Socket ID</th><td
                    >{socket_id}</td
                ></tr
            >
            <tr
                ><th class="py-2 pr-4 whitespace-nowrap">Model name</th><td
                    >{model_name}</td
                ></tr
            >
            <tr
                ><th class="py-2 pr-4 whitespace-nowrap">Clock speed</th><td
                    >{clock_speed.y}</td
                ></tr
            >
            <tr
                ><th class="py-2 pr-4 whitespace-nowrap">Cache size</th><td
                    >{cache_size}</td
                ></tr
            >
            <tr>
                <th class="pr-4 whitespace-nowrap">Flags</th>
                <td class="last">
					<div class="whitespace-pre text-center">
						{tooltip}
					</div>
                    <div
                        class="flex flex-wrap gap-2 justify-between p-4 max-h-44 overflow-y-scroll"
                    >					
                        {#each flag_array as flag}
							<div class='py-1 px-2 bg-cyan-600 rounded-md text-white' on:mouseenter={() => (flag_codes[flag] == undefined ? tooltip = "\n" : tooltip = flag_codes[flag])} on:mouseleave={() => (tooltip = "\n")}>
								{flag}
							</div>
                        {/each}
                    </div>
                </td>
            </tr>
        </table>

        <div style={hover ? "display: none" : ""}>
            <h1 class="text-center text-2xl font-bold">ID {id}</h1>
            <canvas bind:this={canvas}/>
        </div>

</div>
