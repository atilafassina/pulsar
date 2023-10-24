import { Match, Switch, createSignal } from "solid-js";
import { getDirData } from "../commands";
import { open } from "@tauri-apps/api/dialog";
import { ScanStoreSetter } from "../lib/store";

type ScannerProps = {
  setScanData: ScanStoreSetter;
};

export function Scanner(props: ScannerProps) {
  async function scan(scope: string) {
    const start = window.performance.now();
    const list = await getDirData(scope);
    const end = window.performance.now();

    props.setScanData("elapsed", end - start);
    props.setScanData("fileList", list);
  }

  async function getRootScope() {
    const selected = await open({
      directory: true,
      recursive: false,
      multiple: false,
    });

    /**
     * types will be fixed upstream in Tauri soon.
     */
    if (Array.isArray(selected)) {
      return;
    }
    console.info("selected", selected);

    setRootScope(selected);
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

  return (
    <>
      <form
        class="flex flex-[1_1] flex-wrap justify-between h-12 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          console.info(`scanning: ${rootScope()}`);
          scan(rootScope()!);
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
      </form>
    </>
  );
}
