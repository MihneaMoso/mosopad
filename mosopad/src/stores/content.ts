import { browser } from "$app/environment";
import { writable } from "svelte/store";

export interface EditorData {
  compilerOptions: string;
  optimizationLevel: string;
  selectedLanguage: string;
  textareaContent: string;
  compilationOutput: string;
  error: string;
}

const defaultValue: EditorData = {
  compilerOptions: "",
  optimizationLevel: "",
  selectedLanguage: "",
  textareaContent: "",
  compilationOutput: "",
  error: ""
};

function getInitialValue(): EditorData {
  if (!browser) return defaultValue;
  
  try {
    const stored = localStorage.getItem("content");
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error("Failed to parse localStorage content, resetting:", e);
    localStorage.removeItem("content");
    return defaultValue;
  }
}

export const content = writable<EditorData>(getInitialValue());

content.subscribe((value) => {
  if (browser) {
    localStorage.setItem("content", JSON.stringify(value));
  }
});

// Helper to reset store
export function resetContent() {
  content.set(defaultValue);
}
