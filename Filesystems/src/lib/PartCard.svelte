<script>
    import { onMount } from "svelte";
    import { formatSize } from "./formatSize";

    export let part;

    onMount(() => {
        console.log(part);
    })
</script>

<div class=" flex flex-col justify-between gap-1 p-1 border-black border rounded">
    <h2 class=" text-xl font-bold">{part.name}</h2>

    <table class=" w-full text-left bg-zinc-100 rounded">
        <tr>
            <th class="text-left">Size</th>
            <th class="text-left">Used</th>
            <th class="text-left">Free</th>
        </tr>
        <tr>
            <td>{formatSize(part.size)}</td>
            <td>{formatSize(part.used)}</td>
            <td>{formatSize(part.size - part.used)}</td>
        </tr>
    </table>

    {#if part.type}
        <span class=" font-bold">Partition Type: </span><span class="bg-zinc-100 rounded">{part.filesystem} ({part.type})</span>
    {/if}
    
    {#if part.mount_points != null}
    <div>
        <span class=" font-bold">Mountpoints:</span>
        <div>
            {#each part.mount_points as mount}
                <div class="bg-zinc-100 rounded">
                    {mount.Path}<br>
                    <span class=" font-bold">{mount.Options.map(arr => {if(arr[1] == "") return ` ${arr[0]}`; else return ` ${arr[0]} (${arr[1]})` })}</span>
                </div>
            {/each}
        </div>
    </div>
    {/if}
    
</div>