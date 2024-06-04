import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { type FolderStat } from "../commands";

type Data = {
  fileList: FolderStat[];
  elapsed: number;
  status: "idle" | "scanning";

  // computed
  stats: string;
};

export const initialStore: Data = {
  fileList: [],
  elapsed: 0,
  status: "idle",

  get stats() {
    const timespan = (this.elapsed / 1000).toFixed(2);
    return `scanned ${this.fileList.length} projects in ${timespan} seconds.`;
  },
};
const ScanContext = createContext<{
  scanData: Data;
}>();

export const scanStore = createStore(initialStore);
export type ScanStoreSetter = (typeof scanStore)[1];

export function useScan() {
  const ctx = useContext(ScanContext);

  if (!ctx) throw new Error("can not find context");
  return ctx;
}
