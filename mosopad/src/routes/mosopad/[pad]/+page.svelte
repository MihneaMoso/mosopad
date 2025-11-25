<script lang="ts">
    import { enhance } from "$app/forms";
    import { beforeNavigate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import { content, setPad, getPad, getDefaultEditorData } from "../../../stores/content";
    
    let { data, form }: PageProps = $props();

    let editorContainer: HTMLElement;
    let editor: any;

    const padName = data.title;
    
    // Get existing pad data or use server data as fallback
    const existingPad = getPad(padName);
    
    let compilerOptions = $state(
        existingPad?.compilerOptions ?? data.compilerOptions.slice(1).join(" ")
    );
    let optimizationLevel = $state(
        existingPad?.optimizationLevel ?? data.compilerOptions[0]
    );
    let selectedLanguage = $state(
        existingPad?.selectedLanguage ?? data.language
    );
    let textareaContent = $state(
        existingPad?.textareaContent ?? data.editorContent ?? ""
    );
    let lastSavedContent = $state(textareaContent);
    let compilationOutput = $state(existingPad?.compilationOutput ?? "");
    let error = $state(existingPad?.error ?? "");

    const dirty = $derived(textareaContent !== lastSavedContent);

    // Sync state changes back to store for this specific pad
    $effect(() => {
        setPad(padName, {
            padName,
            compilerOptions,
            optimizationLevel,
            selectedLanguage,
            textareaContent,
            compilationOutput,
            error,
        });
    });

    onMount(async () => {
        const monaco = await import("monaco-editor");

        // Register languages (only if not already registered)
        if (!monaco.languages.getLanguages().some(lang => lang.id === 'cpp')) {
            monaco.languages.register({ id: "cpp" });
        }
        if (!monaco.languages.getLanguages().some(lang => lang.id === 'typescript')) {
            monaco.languages.register({ id: "typescript" });
        }

        // example file
        const uri = monaco.Uri.parse('file:///main.cpp');
        
        // Get or create model
        let model = monaco.editor.getModel(uri);
        if (!model) {
            model = monaco.editor.createModel(
                textareaContent,
                'cpp',
                uri
            );
        } else {
            model.setValue(textareaContent);
        }

        // Create editor instance
        editor = monaco.editor.create(editorContainer, {
            model: model,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
        });

        // Sync editor content with state
        textareaContent = editor.getValue();
        editor.onDidChangeModelContent(() => {
            textareaContent = editor.getValue();
        });

        // Cleanup on unmount
        return () => {
            editor?.dispose();
        };
    });


    $effect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (dirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        
        if (form?.output?.error) {
       
             error = form?.output.compile.stderr ?? "";
            compilationOutput = form?.output.error ?? "";
        } else {
            compilationOutput = form?.output?.run?.stdout ?? "";
        }
        
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

<h2>{data.title}</h2>

<select name="langselect" id="langselect" bind:value={selectedLanguage}>
    <option value="CPP">C++</option>
    <option value="Javascript">Javascript</option>
    <option value="Python">Python</option>
</select>
<br /><br />

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
    <label for="monaco-editor">Your code:</label><br /><br />
    
    <!-- Monaco Editor Container -->
    <div bind:this={editorContainer} id="monaco-editor"></div>
    
    <!-- Hidden textarea to submit the code -->
    <textarea
        name="codecontent"
        style="display: none;"
        bind:value={textareaContent}
    ></textarea>

    <br />
    <p>Optimization level:</p>
    <select
        name="optimizationselect"
        id="optimization-select"
        bind:value={optimizationLevel}
    >
        <option value="-O0">O0</option>
        <option value="-O1">O1</option>
        <option value="-O2">O2</option>
        <option value="-O3">O3</option>
    </select>
    <input
        type="text"
        name="compilerFlags"
        id="compilerFlags"
        bind:value={compilerOptions}
    />
    <br />
    <button type="submit">Compile and Run!</button>
</form>
<br />

{#if form && !form?.output?.error}
    <p>Successfully compiled and ran your code! Here is your output:</p>
    <br />
{/if}

<div class="output">{compilationOutput}</div>

{#if form?.output?.error}
    <p>Your code couldn't compile...Here's the output:</p>
    <br />
    <div class="output error">{error}</div>
{/if}

<style>
    h2 {
        color: #50fa7b;
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    select {
        margin: 0.5rem auto;
        display: block;
    }

    form {
        background-color: #1a1f1a;
        border: 2px solid #2a3f2a;
        border-radius: 8px;
        padding: 2rem;
        margin-top: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    label {
        text-align: center;
        display: block;
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    /* Monaco Editor Container */
    #monaco-editor {
        width: 100%;
        max-width: 900px;
        height: 500px;
        margin: 0 auto 1.5rem auto;
        border: 2px solid #2a3f2a;
        border-radius: 8px;
        overflow: hidden;
    }

    input[type="text"] {
        display: block;
        margin: 1rem auto;
    }

    button[type="submit"] {
        display: block;
        margin: 1.5rem auto 0 auto;
        padding: 1rem 2rem;
        font-size: 1.1rem;
    }

    .output {
        background-color: #1f2b1f;
        border: 2px solid #2a3f2a;
        border-radius: 8px;
        padding: 1.5rem;
        margin-top: 2rem;
        min-height: 100px;
        font-family: "Consolas", "Monaco", "Courier New", monospace;
        color: #f8f8f2;
        white-space: pre-wrap;
        overflow-x: auto;
    }

    .output.error {
        border-color: #ff5555;
        background-color: #2b1f1f;
    }

    p {
        text-align: center;
        color: #8be9fd;
        font-size: 1.1rem;
        margin: 1rem 0;
    }

    br {
        display: block;
        content: "";
        margin: 0.5rem 0;
    }
</style>
