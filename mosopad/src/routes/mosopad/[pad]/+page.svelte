

<script lang="ts">
    import type { PageProps } from "./$types";
    let { data } : PageProps = $props();

    console.log("Data:", data);

    const languages = ["CPP", "Javascript", "Python"];
    const normalized = data.language?.toLowerCase();
    let selectedLanguage = $state(
        languages.find(l => l.toLowerCase() === normalized) ?? "CPP"
    );

    let textareaContent = $state("");

    let compilationOutput = $state("");

    async function getCompilationResult() {
        const response = await fetch("/api/compiler", {
            method: 'POST',
            body: JSON.stringify({textareaContent}),
            headers: {'content-type': 'application/json'}
        });

        let response_data = await response.json();
        console.log(response_data)
        compilationOutput = response_data.run.stdout;
    }
</script>

<svelte:head>
    <title>Viewing {data.title}</title>
    <meta name="Pad page" content={"Pad " + data.title + ": " + data.editorContent?.slice(0, 160)}>
</svelte:head>

<h2> 
    {data.title}
</h2>

<select name="langselect" id="langselect" bind:value={selectedLanguage}>
    <option value="CPP">C++</option>
    <option value="Javascript">Javascript</option>
    <option value="Python">Python</option>
</select>
<br>
<textarea name="codeinput" id="codeinput" bind:value={textareaContent}>
    {data.editorContent}
</textarea>
<br>
<button onclick={getCompilationResult}>Compile</button>
<br>
<span>{compilationOutput}</span>

<style>
    h2 {
        color: red;
    }
</style>