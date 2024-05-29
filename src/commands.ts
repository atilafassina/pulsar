/* eslint-disable */
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
  interface Window {
    __TAURI_INTERNALS__: {
      invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
    };
  }
}

// Function avoids 'window not defined' in SSR
const invoke = () => window.__TAURI_INTERNALS__.invoke;

export function getDirData(pattern: string) {
  return invoke()<FolderStat[]>("get_dir_data", { pattern });
}

export type FolderStat = { path: string; size: number };
