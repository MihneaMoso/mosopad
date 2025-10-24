<script lang="ts">
    import type { PageProps } from "./$types";
    let { data } : PageProps = $props();
</script>

<h2>
    {data.title}
</h2>
<div>
    {@html data.content}
</div>

<style>

</style>