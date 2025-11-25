import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        include: ['monaco-editor']
    },
    server: {
        fs: {
            allow: [
                searchForWorkspaceRoot(process.cwd()),
                "../"
            ]
        }
    }
});
