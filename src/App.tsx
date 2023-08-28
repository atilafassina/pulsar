import { For, createSignal } from "solid-js";
import "./App.css";
import { Header } from "./components/header";
import { Scanner } from "./components/scanner";

const all_documents = "../../../*/*/node_modules";
// const only_atila = "../../*/node_modules";
// const only_crab = "../../../crab/*/node_modules";
// const REGEX = "/(.*?)/node_modules";
// const REGEX = /\/([^/]+)\/node_modules$/;
const REGEX = /^(.*\/)([^/]+)\/node_modules$/;

function getDirName(path: string) {
  const match = path.match(REGEX);

  if (match) {
    return {
      prefix: match[1],
      dir: match[2],
    };
  } else {
    return null;
  }
}

function formatSizeUnit(bytes: number) {
  const KILO = 1000;
  const MEGA = KILO * 1000;
  const GIGA = MEGA * 1000;
  const TERA = GIGA * 1000;

  if (bytes > TERA) {
    return Math.trunc(bytes / GIGA) + "tb";
  }

  if (bytes > GIGA) {
    return (bytes / GIGA).toFixed(2) + "gb";
  }

  if (bytes > MEGA) {
    return Math.trunc(bytes / MEGA) + "mb";
  }

  if (bytes > KILO) {
    return (bytes / KILO).toFixed(2) + "kb";
  }

  return Math.trunc(bytes) + "b";
}

function App() {
  const [globPattern, setGlobPattern] = createSignal(all_documents);
  const [folderList, setFolderList] = createSignal([
    ["../../crab/crabnebula.dev/node_modules", 20949875732],
  ]);

  return (
    <main class="bg-neutral-800 grid min-h-screen text-white grid-rows-[auto,1fr,auto]">
      <header class="pt-5 flex space-between items-center w-full">
        <Header />
        <Scanner
          pattern={globPattern()}
          setPattern={setGlobPattern}
          setList={setFolderList}
        />
      </header>
      <div>
        <For each={folderList()}>
          {([path, size]) => {
            if (!Boolean(path)) {
              return null;
            }
            const { prefix, dir } = getDirName(path);
            const modulesSize = formatSizeUnit(size);

            return (
              <div class="flex w-100 justify-around">
                <span>
                  <span class="text-neutral-500">{prefix}</span>
                  <strong>{dir}</strong>
                  <span class="text-neutral-500">/node_modules</span>
                </span>
                <span>{modulesSize}</span>
              </div>
            );
          }}
        </For>
      </div>
      <footer>Built with rusty claws and Tauri</footer>
    </main>
  );
}

export default App;
