import { Show, createSignal } from "solid-js";
import { FolderStat, getDirData } from "../commands";
import { open } from "@tauri-apps/api/dialog";

type ScannerProps = {
  pattern: string;
  setPattern: (val: string) => void;
  setList: (list: FolderStat[]) => void;
};

export function Scanner({ pattern, setPattern, setList }: ScannerProps) {
  const [scanTime, setScanTime] = createSignal(8880);
  async function scan() {
    const start = window.performance.now();
    // console.info(`starting scan: ${start}`);
    const list = await getDirData(pattern);
    const end = window.performance.now();
    // console.info(`scan ended at: ${end}.`);
    console.warn(`elapsed: ${end - start}`);
    setScanTime(end - start);
    setList(list);
  }
  return (
    <form
      class="text-lg whitespace-nowrap"
      onSubmit={(e) => {
        e.preventDefault();
        scan();
      }}
    >
      <input
        class="bg-neutral-200 w-[20rem] text-neutral-900 px-1 placeholder-neutral-800 rounded-tl-md rounded-bl-md"
        onChange={(e) => setPattern(e.currentTarget.value)}
        placeholder="Enter a glob..."
      />
      <button
        type="submit"
        class="bg-neutral-200 text-neutral-900 py-5 px-4 rounded-full shadow-md ring-2 ring-black"
      >
        scan
      </button>
      <button
        type="button"
        class="text-lg text-pink-600 ring-2 ring-pink-600"
        onClick={async () => {
          const selected = await open({
            directory: true,
            recursive: false,
          });

          console.log(selected);
        }}
      >
        Big ass button
      </button>
      <Show when={scanTime() > 0}>
        <small class="block">scanned in: {scanTime() / 1000} seconds.</small>
      </Show>
    </form>
  );
}
