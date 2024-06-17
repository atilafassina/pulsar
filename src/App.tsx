import { Match, Show, Switch, onMount } from "solid-js";
import { Logo } from "./components/logo";
import { Scanner } from "./components/scanner";
import Footer from "./components/footer";
import ResultsTable from "./components/results-table";
import "./App.css";
import { scanStore } from "./lib/store";
import { checkForAppUpdates } from "./lib/updater";

function App() {
  const [scanData, setScanData] = scanStore;
  const hasItems = () => scanData.fileList.length > 0;

  onMount(async () => {
    await checkForAppUpdates(false);
  });

  return (
    <>
      <main class="grid min-h-screen  bg-neutral-800 bg-opacity-60 text-white grid-rows-[auto,1fr,auto]">
        <header class="pt-5 px-10 w-full flex sm:flex-row flex-col sm:justify-between items-center gap-6 sm:gap-28">
          <Logo />
          <Scanner setScanData={setScanData} />
        </header>

        <article class="px-10 h-full grid-rows-[auto,1fr] place-items-center">
          <Show when={scanData.elapsed > 0}>
            <strong class="block text-center text-2xl pt-5">
              {scanData.stats}
            </strong>
          </Show>
          <div class="w-full">
            <ul class="flex justify-center items-center gap-5 w-full py-5">
              <li>
                <button>delete selected</button>
              </li>
              <li>
                <button>select all</button>
              </li>
            </ul>
          </div>
          <div class="w-full pt-24">
            <Switch>
              <Match when={scanData.status === "scanning"}>
                <p class="grid place-items-center text-4xl">scanning...</p>
              </Match>
              <Match when={hasItems()}>
                <ResultsTable folderList={scanData.fileList} />
              </Match>
              <Match when={scanData.status === "idle" && !hasItems()}>
                <p class=" grid place-items-center text-3xl text-neutral-400 font-mono border-2 rounded-lg border-neutral-800 py-10 bg-black/40 backdrop:blur-lg">
                  🤖 waiting on search
                </p>
              </Match>
            </Switch>
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}

export default App;
