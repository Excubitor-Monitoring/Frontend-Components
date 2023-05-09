<svelte:options tag="cpu-info" />

<script>

	import { onMount } from 'svelte';
    import CpuCard from './CpuCard.svelte';

	onMount(() => {
		window.addEventListener("CPU.CpuInfo", (event) => {
			data = event.detail;
		})

		window.dispatchEvent((new CustomEvent("SUB2SOCKET", {
				detail: "CPU.CpuInfo"
		})))
		console.log("SUB2SOCKET");
	});

	let data =	[{
			id: 0,
			core_id: 0,
			socket_id: 0,
			model_name: "Processor1",
			clock_speed: 0,
			cache_size: 0,
			flags: "flag_1 flag_2"
		}]

</script>

{#each data as cpu}
	<CpuCard {...cpu}/>
{/each}

