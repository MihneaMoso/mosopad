<script lang="ts">

	let { children } = $props();
</script>

<div class="app">

	<main>
		{@render children()}
	</main>

</div>

<style>
	:global(h1, h2, h3, h4, h5, h6) {
		color: #50fa7b;
		font-weight: 600;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	:global(h1) {
		font-size: 2.5rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	:global(h2) {
		font-size: 2rem;
		text-align: center;
		margin-bottom: 1.25rem;
	}

	:global(input[type="text"],
	input[type="email"],
	input[type="password"],
	input[type="search"]) {
		background-color: #1f2b1f;
		border: 2px solid #2a3f2a;
		border-radius: 6px;
		color: #e0e0e0;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-family: inherit;
		transition: all 0.2s ease;
		width: 100%;
		max-width: 400px;
	}

	:global(input[type="text"]:focus,
	input[type="email"]:focus,
	input[type="password"]:focus,
	input[type="search"]:focus) {
		outline: none;
		border-color: #50fa7b;
		background-color: #242f24;
		box-shadow: 0 0 0 3px rgba(80, 250, 123, 0.1);
	}

	:global(button) {
		background-color: #50fa7b;
		color: #1a1f1a;
		border: none;
		border-radius: 6px;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	:global(button:hover) {
		background-color: #69ff94;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(80, 250, 123, 0.3);
	}

	:global(button:active) {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	:global(ul) {
		list-style: none;
		padding: 0;
		margin: 1rem 0;
	}

	:global(li) {
		padding: 0.5rem 0;
	}

	:global(li a) {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: #1f2b1f;
		border: 2px solid #2a3f2a;
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	:global(li a:hover) {
		background-color: #242f24;
		border-color: #50fa7b;
		text-decoration: none;
		transform: translateX(5px);
	}

	.app {

	}

	main {
		padding: 1.5rem;
	}

</style>