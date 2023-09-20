import { Accessor, For } from "solid-js";
import { formatSizeUnit } from "../lib/format";
import { getDirName } from "../lib/get-dir-name";

type ResultsItem = {
  path: string;
  size: number;
};

type ListProps = {
  folderList: Accessor<ResultsItem[]>;
};

export default function ResultsList({ folderList }: ListProps) {
  return (
    <div class="w-full py-12">
      <table class="w-full text-center">
        <thead>
          <tr class="mb-8">
            <th class="w-3/5 text-left">Name</th>
            <th class="w-2/5">Size</th>
            {/* <th class="w-1/5">Action</th> */}
          </tr>
        </thead>
        <tbody>
          <For each={folderList()}>
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
                <tr>
                  <td class="text-left pt-6">
                    <strong class="text-neutral-50 block">{dirName.dir}</strong>
                    <small class="text-neutral-300">
                      {dirName.prefix}
                      {dirName.dir}/node_modules
                    </small>
                  </td>
                  <td>{modulesSize}</td>
                  {/* <td>
                    <label for={dirName.prefix + dirName.dir}>select</label>
                    <input
                      class="sr-only"
                      id={dirName.prefix + dirName.dir}
                      type=""
                      value={dirName.prefix + dirName.dir}
                    />
                  </td> */}
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
    </div>
  );
}
