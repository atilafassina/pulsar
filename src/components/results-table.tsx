import { For, Show, createResource, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import { formatSizeUnit } from "../lib/format";
import { getDirName } from "../lib/get-dir-name";
import { Trashbin } from "./trashbin";
import { exists, remove } from "@tauri-apps/plugin-fs";
import { confirm } from "@tauri-apps/plugin-dialog";
import { type FolderStat } from "../commands";
import { Checkbox } from "@kobalte/core";

type ListProps = {
  folderList: FolderStat[];
};

type TRprops = {
  directory: string;
  directoryPrefix: string;
  modulesSize: string;
};

function deleteNodeModules(path: string) {
  return async (_shouldDelete: boolean) => {
    const fileExists = await exists(path);

    if (fileExists) {
      console.warn(":: deleting ::");
      await remove(`${path}/node_modules`, { recursive: true });
    }

    return true;
  };
}

function TableRow(props: TRprops) {
  const [shouldDelete, setDelete] = createSignal(false);

  const [data] = createResource(
    shouldDelete,
    deleteNodeModules(props.directoryPrefix + props.directory),
  );

  async function confirmDelete() {
    const shouldDelete = await confirm(
      `${props.directoryPrefix + props.directory} will be DELETED.
    
    Are you sure?
    `,
      {
        kind: "warning",
        title: "NON-REVERSIBLE ACTION",
        okLabel: "DELETE",
      },
    );

    setDelete(shouldDelete);
  }

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
          <ul class="flex space-around items-center gap-4">
            <li>
              <Checkbox.Root class="checkbox grid">
                <Checkbox.Input class="hidden" onChange={() => {}} />
                <Checkbox.Control class="h-5 w-5 rounded-md border border-solid border-gray-300 bg-gray-200 grid place-items-center">
                  <Checkbox.Indicator class="w-full h-full block bg-slate-500 rounded-lg" />
                </Checkbox.Control>
              </Checkbox.Root>
            </li>
            <li>
              <button
                type="button"
                onClick={async () => {
                  await confirmDelete();
                }}
              >
                <Trashbin />
              </button>
            </li>
          </ul>
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
