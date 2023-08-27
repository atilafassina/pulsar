import { For, createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

//  const all_documents = "../../../*/*/node_modules"
const only_atila = "../../*/node_modules";
const REGEX = "/(.*?)/node_modules";

function getDirName(path: string) {
  const match = path.match(REGEX);
  return match ? match[1] : null;
}

function App() {
  const [globPattern, setGlobPattern] = createSignal(only_atila);
  const [folderList, setFolderList] = createSignal([[]]);

  async function scan() {
    let start = window.performance.now();
    console.info(`starting scan: ${start}`);
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setFolderList(await invoke("get_dir_data", { pattern: globPattern() }));

    let end = window.performance.now();
    console.info(`scan ended at: ${end}.`);
    console.warn(`elapsed: ${end - start}`);
  }
  return (
    <div class="container">
      <h1>
        Keep an eye on your <code>node_modules</code> or not
      </h1>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          scan();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setGlobPattern(e.currentTarget.value)}
          placeholder="Enter a glob..."
        />
        <button type="submit">scan</button>
      </form>

      <For each={folderList()}>
        {([path, size]) =>
          Boolean(path) ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                "justify-content": "space-around",
              }}
            >
              <strong>{getDirName(path)}</strong>
              <span>{Number(size) / 1000000} mb</span>
            </div>
          ) : null
        }
      </For>
    </div>
  );
}

export default App;
