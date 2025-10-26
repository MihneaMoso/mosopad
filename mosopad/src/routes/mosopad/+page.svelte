<script lang="ts">
	let padInput = $state("");
</script>

<svelte:head>
	<title>Mosopad</title>
	<meta name="description" content="An online C/C++ compiler and project manager" />
</svelte:head>

<main>
	<h1>
		Welcome to Mosopad!
	</h1>
	<h2>
		Create your very own pad here: <input type="text" bind:value={padInput}>
	</h2>

	<h2>
		Or create <a href="/signup">an account</a>
		<br>
		<br>
		Or <a href="/login">login</a>
	</h2>
</main>

<style>
    
</style>