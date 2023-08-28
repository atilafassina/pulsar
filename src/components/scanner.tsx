import { invoke } from "@tauri-apps/api/tauri";

type ScannerProps = {
  pattern: string;
  setPattern: (val: string) => void;
  setList: (list: string[]) => void;
};

export function Scanner({ pattern, setPattern, setList }: ScannerProps) {
  async function scan() {
    let start = window.performance.now();
    console.info(`starting scan: ${start}`);
    setList(await invoke("get_dir_data", { pattern }));

    let end = window.performance.now();
    console.info(`scan ended at: ${end}.`);
    console.warn(`elapsed: ${end - start}`);
  }
  return (
    <form
      class="w-full h-full grid place-items-center"
      onSubmit={(e) => {
        e.preventDefault();
        scan();
      }}
    >
      <input
        onChange={(e) => setPattern(e.currentTarget.value)}
        placeholder="Enter a glob..."
      />
      <button type="submit">scan</button>
    </form>
  );
}
