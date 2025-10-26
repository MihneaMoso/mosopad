

<script lang="ts">
    import type { PageProps } from "./$types";
    let { data } : PageProps = $props();

    console.log("Data:", data);

    let min = $state(0);
    let max = $state(0);

    let randomNumber = $state(0);

    async function getRandomNumber() {
        const response = await fetch("/api/random-number", {
            method: 'POST',
            body: JSON.stringify({min, max}),
            headers: {'content-type': 'application/json'}
        });

        randomNumber = await response.json();
    }
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

<p>Random number between </p>
<input type="number" name="Min" bind:value={min}> and  
<input type="number" name="Max" bind:value={max}> is 
<span>{randomNumber}</span>
<button onclick={getRandomNumber}>Calculate</button>

<style>
    h2 {
        color: red;
    }
</style>