<script lang="ts">

	let { children } = $props();
</script>

<div class="app">

	<main>
		{@render children()}
	</main>

</div>

<style>
	:global(select) {
		background-color: #1f2b1f;
		border: 2px solid #2a3f2a;
		border-radius: 6px;
		color: #e0e0e0;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 150px;
	}

	:global(select:hover) {
		border-color: #3a5f3a;
	}

	:global(select:focus) {
		outline: none;
		border-color: #50fa7b;
		background-color: #242f24;
		box-shadow: 0 0 0 3px rgba(80, 250, 123, 0.1);
	}

	:global(option) {
		background-color: #1f2b1f;
		color: #e0e0e0;
		padding: 0.5rem;
	}

	:global(label) {
		color: #8be9fd;
		font-size: 1.1rem;
		font-weight: 500;
		display: block;
		margin-bottom: 0.5rem;
	}

	:global(textarea) {
		background-color: #1f2b1f;
		border: 2px solid #2a3f2a;
		border-radius: 6px;
		color: #e0e0e0;
		padding: 1rem;
		font-size: 1rem;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		line-height: 1.5;
		resize: vertical;
		width: 100%;
		min-height: 300px;
		transition: all 0.2s ease;
	}

	:global(textarea:focus) {
		outline: none;
		border-color: #50fa7b;
		background-color: #242f24;
		box-shadow: 0 0 0 3px rgba(80, 250, 123, 0.1);
	}

	:global(code) {
		display: block;
		width: 100%;
	}

	:global(form) {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
		width: 100%;
	}

	:global(form > *) {
		margin: 0;
	}

	:global(form br) {
		display: none;
	}

	:global(p) {
		color: #bd93f9;
		font-size: 1.05rem;
		margin: 0.5rem 0;
	}

	:global(div) {
		width: 100%;
	}

	.app {
		
	}

	main {
		padding: 1.5rem;
		max-width: 1200px;
	}

</style>