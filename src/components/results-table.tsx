import { For, Show, createResource, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import { formatSizeUnit } from "../lib/format";
import { getDirName } from "../lib/get-dir-name";
import { Trashbin } from "./trashbin";
import { exists, removeDir } from "@tauri-apps/api/fs";
import { confirm } from "@tauri-apps/api/dialog";
import { type FolderStat } from "../commands";

type ListProps = {
  folderList: FolderStat[];
};

function deleteNodeModules(path: string) {
  return async (_shouldDelete: boolean) => {
    const fileExists = await exists(path);

    if (fileExists) {
      const shouldDelete = await confirm(
        `${path} will be DELETED.
      
      Are you sure?
      `,
        {
          okLabel: "DELETE",
          title: "NON-REVERSIBLE ACTION",
          type: "warning",
        }
      );

      if (shouldDelete) {
        await new Promise((r) => {
          setTimeout(() => r("done")), 5000;
        });

        console.warn(":: deleting ::");
        return true;
      }
    }

    return false;
  };
}

type TRprops = {
  directory: string;
  directoryPrefix: string;
  modulesSize: string;
};

function TableRow(props: TRprops) {
  const [shouldDelete, setDelete] = createSignal(false);

  const [data, { mutate }] = createResource(
    shouldDelete,
    deleteNodeModules(props.directoryPrefix + props.directory)
  );
  return (
    <Show when={!data()}>
      <tr
        class={`even:bg-black even:bg-opacity-60 transition-transform ease-in-out duration-300 hover:scale-x-105 group`}
      >
        <td class="text-left py-6">
          <strong class="text-neutral-50 text-2xl block pl-6 group-hover:scale-110 group-hover:scale-x-105 transition-transform duration-300 ease-in-out">
            {props.directory}
          </strong>
          <small class="text-neutral-300 pl-6">
            {props.directoryPrefix}
            {props.directory}/node_modules
          </small>
        </td>
        <td class="py-6">{props.modulesSize}</td>
        <td class="py-6">
          <button
            type="button"
            onClick={() => {
              mutate(true);
              setDelete(true);
            }}
          >
            <Trashbin />
          </button>
        </td>
      </tr>
    </Show>
  );
}

export default function ResultsTable(props: ListProps) {
  return (
    <table class="w-full text-center">
      <thead class="sticky top-0 backdrop-blur-xl">
        <tr class="text-2xl font-mono">
          <th class="w-3/5 text-left pl-6 py-3 ">Name</th>
          <th class="w-1/5 py-3 ">Size</th>
          <th class="w-1/5 py-3 ">Action</th>
        </tr>
      </thead>
      <tbody>
        <TransitionGroup
          name="fade"
          exitActiveClass="fade-exit-active"
          exitToClass="fade-exit-to"
        >
          <For each={props.folderList}>
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
                <TableRow
                  modulesSize={modulesSize}
                  directory={dirName.dir}
                  directoryPrefix={dirName.prefix}
                />
              );
            }}
          </For>
        </TransitionGroup>
      </tbody>
    </table>
  );
}
