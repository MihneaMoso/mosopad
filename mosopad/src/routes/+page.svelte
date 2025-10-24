<script lang="ts">
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcomeFallback from '$lib/images/svelte-welcome.png';
	import { building } from "$app/environment";

	if (!building) {
		console.log("Not building ;)")
	}

	export function load() {

	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Mosopad application" />
</svelte:head>

<main>
	<h1>
		Welcome to Mosopad!
	</h1>
	<section>
		<p>
			Mosopad is an online code editor environment made by <a href="https://github.com/MihneaMoso">Mihnea Moso</a>.
			It is a pretty ambitious project that aims to be an OnlineGDB clone at its core and provide a secure
			online coding enviromnent with user accounts, 
		</p>
	</section>

</main>
<style>


</style>
