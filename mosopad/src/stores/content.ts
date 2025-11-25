import { browser } from "$app/environment";
import { writable } from "svelte/store";

export interface EditorData {
  compilerOptions: string;
  optimizationLevel: string;
  selectedLanguage: string;
  textareaContent: string;
  compilationOutput: string;
  error: string;
  padName: string;
}

export interface MosopadData {
  pads: Record<string, EditorData>; // key = padname, value = editordata
}

const defaultEditorData: EditorData = {
  compilerOptions: "",
  optimizationLevel: "",
  selectedLanguage: "",
  textareaContent: "",
  compilationOutput: "",
  error: "",
  padName: "",
};
const defaultValue: MosopadData = {
  pads: {}
}

function getInitialValue(): MosopadData {
  if (!browser) return defaultValue;
  
  try {
    
    const stored = localStorage.getItem("mosopad-data");
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error("Failed to parse localStorage content, resetting:", e);
    localStorage.removeItem("mosopad-data");
    return defaultValue;
  }
}

export const content = writable<MosopadData>(getInitialValue());

export function getPad(padName: string): EditorData | undefined {
  let result: EditorData | undefined;
  content.subscribe(data => {
    result = data.pads[padName];
  })();
  return result;
}

export function setPad(padName: string, data: EditorData): void {
  content.update(state => ({
    ...state,
    pads: {
      ...state.pads,
      [padName]: data
    }
  }));
}

export function deletePad(padName: string) {
  content.update(state => {
    const { [padName]: _, ...rest } = state.pads;
    return { ...state, pads: rest };
  });
}

export function getAllPadNames(): string[] {
  let names: string[] = [];
  content.subscribe(data => {
    names = Object.keys(data.pads);
  })();
  return names;
}

// Helper to reset store
export function resetContent() {
  content.set(defaultValue);
}

export function getDefaultEditorData(): EditorData {
  return { ...defaultEditorData };
}

content.subscribe((value) => {
  if (browser) {
    localStorage.setItem("mosopad-data", JSON.stringify(value));
  }
});


