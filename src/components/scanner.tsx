import { FolderStat, getDirData } from "../commands";

type ScannerProps = {
  pattern: string;
  setPattern: (val: string) => void;
  setList: (list: FolderStat[]) => void;
};

export function Scanner({ pattern, setPattern, setList }: ScannerProps) {
  async function scan() {
    let start = window.performance.now();
    console.info(`starting scan: ${start}`);
    const list = await getDirData(pattern);
    let end = window.performance.now();
    console.info(`scan ended at: ${end}.`);
    console.warn(`elapsed: ${end - start}`);
    console.log(list);
    setList(list);
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
        class="text-gray-800 px-1"
        onChange={(e) => setPattern(e.currentTarget.value)}
        placeholder="Enter a glob..."
      />
      <button type="submit">scan</button>
    </form>
  );
}
