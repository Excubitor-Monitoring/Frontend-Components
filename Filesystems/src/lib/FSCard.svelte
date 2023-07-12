<script>
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    import PartCard from "./PartCard.svelte";
    import { formatSize } from "./formatSize";

    export let fs;

    let hover = false;

    let config = {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Used",
                    backgroundColor: '#ff638480',
                    data: [],
                },
                {
                    label: "Free",
                    backgroundColor: '#36a2eb80',
                    data: [],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    };

    let canvas;
    let chart;

    onMount(() => {
        if (fs.partitions != null) {
            fs.partitions.forEach((part) => {
                config.data.labels.push(part.name);
                config.data.datasets[0].data.push(part.used);
                config.data.datasets[1].data.push(part.size - part.used);
            });
            chart = new Chart(canvas, config);
        }
    });
</script>

<div class="card p-4 border border-solid border-black rounded-lg flex flex-col justify-center" on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)} on:mou>

    <div class=" min-h-full flex flex-col justify-between items-stretch" style={!hover || !fs.partitions?.length ? "" : "display: none"}>
        <div>
            <h1 class="text-center text-2xl font-bold" >{fs.name}</h1>
            Size: {formatSize(fs.size)}
        </div>
        <div class=" grow">
            <canvas class="" bind:this={canvas} />
        </div>
    </div>
    
    {#if fs.partitions?.length}
        <div class=" min-h-full flex flex-col justify-between items-stretch" style={hover ? "" : "display: none"}>
            <h1 class="text-center text-2xl font-bold">Partitions</h1>
            <div class="grow flex flex-col justify-between gap-5 overflow-y-auto">
                {#each fs.partitions as part}
                    <PartCard {part} />
                {/each}
            </div>
        </div>
    {/if}

</div>
