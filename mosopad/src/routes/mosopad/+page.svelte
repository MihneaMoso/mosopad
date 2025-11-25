<script lang="ts">
    import { goto } from '$app/navigation';

    let padInput = $state("");

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && padInput.trim()) {
            goto(`/mosopad/${padInput.trim()}`);
        }
    }

    function handleSubmit(event: Event) {
        event.preventDefault();
        if (padInput.trim()) {
            goto(`/mosopad/${padInput.trim()}`);
        }
    }
</script>

<svelte:head>
	<title>Mosopad</title>
	<meta name="description" content="An online C/C++ compiler and project manager" />
</svelte:head>

<main>
    <h1>Welcome to Mosopad!</h1>
    
    <form onsubmit={handleSubmit}>
        <h2>
            Create your very own pad here:
        </h2>
        <input 
            id="padinput" 
            type="text" 
            bind:value={padInput}
            onkeydown={handleKeydown}
            placeholder="Enter pad name..."
            autocomplete="off"
        />
        <button type="submit">Go</button>
    </form>

    <h2>
        Or <a href="/signup">create an account</a>
    </h2>
    
    <h2>
        Or <a href="/login">login</a>
    </h2>
</main>

<style>
    main {
        text-align: center;
        padding: 2rem;
    }

    h1 {
        color: #50fa7b;
        font-size: 2.5rem;
        margin-bottom: 2rem;
    }

    h2 {
        color: #8be9fd;
        font-size: 1.3rem;
        margin: 1.5rem 0;
    }

    form {
        margin: 2rem 0;
    }

    #padinput {
        margin: 1rem 0;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        min-width: 300px;
    }

    button {
        margin-left: 0.5rem;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
    }

    a {
        color: #50fa7b;
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: border-color 0.2s;
    }

    a:hover {
        border-bottom-color: #50fa7b;
    }
</style>