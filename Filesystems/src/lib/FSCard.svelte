<script>
    export let fs;
</script>

<div>
    <h1>{fs.name}</h1>
    Size: {fs.size}
    <pre>
        {#if fs.partitions != null}
            {JSON.stringify(fs.partitions,null,'\t')}
        {/if}
    </pre>
</div>