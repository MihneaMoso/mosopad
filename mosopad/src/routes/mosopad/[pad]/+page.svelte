<script lang="ts">
    import { enhance } from "$app/forms";
    import { beforeNavigate } from "$app/navigation";
    import type { PageProps } from "./$types";
    let { data, form }: PageProps = $props();

    console.log("Data:", data);

    const languages = ["CPP", "Javascript", "Python"];
    const normalized = data.language?.toLowerCase();
    let selectedLanguage = $state(
        languages.find((l) => l.toLowerCase() === normalized) ?? "CPP"
    );

    let textareaContent = $state(data.editorContent ?? "");
    let lastSavedContent = $state(textareaContent);

    let compilationOutput = $state("");

    const dirty = $derived(textareaContent !== lastSavedContent);

    $effect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (dirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        compilationOutput = form?.output.run.stdout ?? "";
        return () => window.removeEventListener("beforeunload", handler);
    });

    beforeNavigate((nav) => {
        if (dirty && !confirm("You have unsaved changes. Leave this page?")) {
            nav.cancel();
        }
    });
</script>

<svelte:head>
    <title>Viewing {data.title}</title>
    <meta
        name="Pad page"
        content={"Pad " + data.title + ": " + data.editorContent?.slice(0, 160)}
    />
</svelte:head>

<h2>
    {data.title}
</h2>

<select name="langselect" id="langselect" bind:value={selectedLanguage}>
    <option value="CPP">C++</option>
    <option value="Javascript">Javascript</option>
    <option value="Python">Python</option>
</select>
<br />
<form
    method="POST"
    action="?/submitCode"
    use:enhance={() => {
        return async ({ result, update }) => {
            // Keep form field values as-is after submit
            await update({ reset: false });

            if (result.type === "success") {
                // Mark current content as saved
                lastSavedContent = textareaContent;
            }
        };
    }}
>
    <label for="codeinput">Your code: </label><br />
    <textarea
        name="codecontent"
        id="codeinput"
        rows="5"
        cols="40"
        bind:value={textareaContent}
    >
        
    </textarea><br />
    <button type="submit">Compile and Run!</button>
</form>

<div>{compilationOutput}</div>

<style>
    h2 {
        color: red;
    }
</style>
