

<script lang="ts">
    import type { PageProps } from "./$types";
    let { data } : PageProps = $props();

    console.log("Data:", data)
</script>

<svelte:head>
    <title>Viewing {data.title}</title>
    <meta name="Pad page" content={"Pad " + data.title + ": " + data.content?.slice(0, 160)}>
</svelte:head>

<h2> 
    {data.title}
</h2>
<div>
    {@html data.content}
</div>

<style>
    h2 {
        color: red;
    }
</style>