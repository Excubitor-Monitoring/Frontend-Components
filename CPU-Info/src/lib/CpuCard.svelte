<script>
    import { chart } from "svelte-apexcharts";
    import {flag_codes} from "./flags"

    export let id = 0;
    export let core_id = 0;
    export let socket_id = 0;
    export let model_name = "";
    export let clock_speed = [];
    export let cache_size = 0;
    export let flags = "";

    let hover = false;

	let tooltip = "\n";

    $: flag_array = flags.toUpperCase().split(" ");

    $: options = {
        chart: {
            type: "line",
            toolbar: {
                show: false,
            },
        },
        series: [
            {
                data: clock_speed,
            },
        ],
        yaxis: {
            labels: {
                formatter: function (value) {
                    return Math.round(value);
                },
            },
        },
        xaxis: {
            type: "datetime",
        },
        legend: {
            show: false,
        },
    };
</script>

<div
    class="card p-4 border-2 border-solid border-black rounded-lg flex flex-col justify-center"
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
>
    {#if hover}
        <table class="text-left border-collapse divide-y-2 divide-solid">
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
                    >{clock_speed.at(-1)[1]}</td
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
							<div class='py-1 px-2 bg-cyan-700 border-2 border-solid border-cyan-950 rounded-md text-white' on:mouseenter={() => (tooltip = flag_codes[flag])} on:mouseleave={() => (tooltip = "\n")}>
								{flag}
							</div>
                        {/each}
                    </div>
                </td>
            </tr>
        </table>
    {:else}
        <h1 class="text-center text-2xl font-bold">ID {id}</h1>
        <div use:chart={options} />
    {/if}
</div>
