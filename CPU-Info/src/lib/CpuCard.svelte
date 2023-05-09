<svelte:options tag="cpu-card" />

<script>
    export let id = 0;
    export let core_id = 0;
    export let socket_id = 0;
    export let model_name = "";
    export let clock_speed = 0;
    export let cache_size = 0;
    export let flags = "";

    $: flag_array = flags.split(" ");

</script>

<div>
    <table>
        <tr>ID<th></th><td>{id}</td></tr>
        <tr>Core ID<th></th><td>{core_id}</td></tr>
        <tr>Socket ID<th></th><td>{socket_id}</td></tr>
        <tr>Model name<th></th><td>{model_name}</td></tr>
        <tr>Clock speed<th></th><td>{clock_speed}</td></tr>
        <tr>Cache size<th></th><td>{cache_size}</td></tr>
        <tr>Flags<th></th>
            <td>
                {#each flag_array as flag}
                    <div>
                        {flag}
                    </div>
                {/each}
            </td>
        </tr>
    </table>
</div>