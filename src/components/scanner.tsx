import { Match, Show, Switch, createSignal } from "solid-js";
import { FolderStat, getDirData } from "../commands";
import { open } from "@tauri-apps/api/dialog";

type ScannerProps = {
  pattern: string;
  setPattern: (val: string) => void;
  setList: (list: FolderStat[]) => void;
};

export function Scanner({ setList }: ScannerProps) {
  async function scan(scope: string) {
    const start = window.performance.now();
    console.info(`starting scan: ${start}`);
    console.info("scope", scope);
    const list = await getDirData(scope);
    const end = window.performance.now();
    console.info(`scan ended at: ${end}.`);
    console.warn(`elapsed: ${end - start}`);
    setScanTime(end - start);
    setList(list);
  }

  async function getRootScope() {
    const selected = await open({
      directory: true,
      recursive: false,
      multiple: false,
    });

    if (Array.isArray(selected)) {
      // can't have multiple
      // type issue?
      return;
    }

    setRootScope(selected);
    console.log(selected);
    setGlob(`${selected}`);
  }

  const [rootScope, setRootScope] = createSignal<string | null>(null);
  const hasScope = () => typeof rootScope() === "string";

  const rootScopeDisplay = () => {
    const scope = rootScope();
    if (scope === null) return null;

    return scope.length > 30
      ? `...${scope.substring(scope.length - 10, scope.length)}`
      : scope;
  };
  const [scanTime, setScanTime] = createSignal(0);
  const [glob, setGlob] = createSignal("");

  return (
    <>
      <form
        class="flex flex-[1_1] flex-wrap justify-between h-12"
        onSubmit={(e) => {
          e.preventDefault();
          console.info(`scanning: ${glob()}`);
          scan(glob());
        }}
      >
        <button
          type="button"
          class="text-lg bg-neutral-400 text-neutral-300 bg-opacity-40 h-fit self-center py-2 px-4 rounded-md shadow-sm shadow-neutral-700"
          onClick={getRootScope}
        >
          <Switch fallback="Select scope">
            <Match when={hasScope()}>
              <small>{rootScopeDisplay()}</small>
            </Match>
          </Switch>
        </button>
        <button
          type="submit"
          disabled={!hasScope()}
          class="ring-fuchsia-500 text-fuchsia-400 py-2 px-4 text-2xl rounded-full shadow-md shadow-fuchsia-600 ring-2 disabled:ring-neutral-800 disabled:text-neutral-400"
        >
          scan
        </button>
        <Show when={scanTime() > 0}>
          <small class="block">
            scanned in: {(scanTime() / 1000).toFixed(2)} seconds.
          </small>
        </Show>
      </form>
    </>
  );
}
