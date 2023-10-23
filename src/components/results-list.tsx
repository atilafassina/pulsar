import { Accessor, For, Show, createResource } from "solid-js";
import { formatSizeUnit } from "../lib/format";
import { getDirName } from "../lib/get-dir-name";
import { Trashbin } from "./trashbin";
import { exists, removeDir } from "@tauri-apps/api/fs";
import { isAbsolute } from "@tauri-apps/api/path";

type ResultsItem = {
  path: string;
  size: number;
};

type ListProps = {
  folderList: Accessor<ResultsItem[]>;
};

async function deleteNodeModules(path: string) {
  // return createResource(async () => {
  const absolute = await isAbsolute(path);
  console.warn("the path is absolute::", absolute);
  console.info("path is::", path);
  const result = await exists(path);

  console.log("file exists", result);
  return result;
  // });
}

export default function ResultsList(props: ListProps) {
  const hasItems = () => props.folderList().length > 0;

  return (
    <div class="w-full py-12">
      <Show when={hasItems()} fallback="waiting for search...">
        <table class="w-full text-center">
          <thead class="sticky top-0 backdrop-blur-xl">
            <tr class="text-2xl font-mono">
              <th class="w-3/5 text-left pl-6 py-3 ">Name</th>
              <th class="w-1/5 py-3 ">Size</th>
              <th class="w-1/5 py-3 ">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.folderList()}>
              {({ path, size }) => {
                if (!Boolean(path)) {
                  return null;
                }
                const dirName = getDirName(path);
                if (dirName === null) {
                  return null;
                }
                const modulesSize = formatSizeUnit(size);

                return (
                  <tr class="even:bg-black even:bg-opacity-60 transition-transform ease-in-out duration-300 hover:translate-x-2 group">
                    <td class="text-left py-6">
                      <strong class="text-neutral-50 text-2xl block pl-6 group-hover:scale-110 group-hover:translate-x-2 transition-transform duration-300 ease-in-out">
                        {dirName.dir}
                      </strong>
                      <small class="text-neutral-300 pl-6">
                        {dirName.prefix}
                        {dirName.dir}/node_modules
                      </small>
                    </td>
                    <td class="py-6">{modulesSize}</td>
                    <td class="py-6">
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteNodeModules(dirName.prefix + dirName.dir);
                        }}
                      >
                        <Trashbin />
                      </button>
                    </td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </Show>
    </div>
  );
}
