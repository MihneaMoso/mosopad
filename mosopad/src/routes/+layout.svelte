<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			Made by <a href="https://github.com/MihneaMoso">MihneaMoso</a> with ❤️
		</p>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #1a1f1a;
		color: #e0e0e0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 16px;
		line-height: 1.6;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(a) {
		color: #50fa7b;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	:global(a:hover) {
		color: #69ff94;
		text-decoration: underline;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: linear-gradient(135deg, #1a1f1a 0%, #0d120d 100%);
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 2rem 1.5rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1.5rem;
		background-color: #0d120d;
		border-top: 2px solid #2a3f2a;
		margin-top: 2rem;
	}

	footer p {
		margin: 0;
		color: #8be9fd;
		font-size: 0.95rem;
	}

	footer a {
		font-weight: 600;
		color: #50fa7b;
	}

	@media (min-width: 480px) {
		footer {
			padding: 1.5rem 0;
		}
		
		main {
			padding: 2.5rem 2rem;
		}
	}
</style>
