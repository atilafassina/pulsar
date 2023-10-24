import { Match, Show, Switch } from "solid-js";
import { Logo } from "./components/logo";
import { Scanner } from "./components/scanner";
import Footer from "./components/footer";
import ResultsTable from "./components/results-table";
import "./App.css";
import { scanStore } from "./lib/store";

function App() {
  const [scanData, setScanData] = scanStore;
  const hasItems = () => scanData.fileList.length > 0;

  return (
    <>
      <main class="grid min-h-screen bg-neutral-800 bg-opacity-60 text-white grid-rows-[auto,1fr,auto]">
        <header class="pt-5 px-10 w-full flex sm:flex-row flex-col sm:justify-between items-center gap-6 sm:gap-28">
          <Logo />
          <Scanner setScanData={setScanData} />
        </header>
        <article class="px-10">
          <Show when={scanData.elapsed > 0}>
            <strong class="block text-center text-2xl pt-5">
              {scanData.stats}
            </strong>
          </Show>
          <div class="w-full pt-6">
            <Switch>
              <Match when={scanData.status === "scanning"}>
                <p>scanning...</p>
              </Match>
              <Match when={hasItems()}>
                <ResultsTable folderList={scanData.fileList} />
              </Match>
              <Match when={scanData.status === "idle" && !hasItems()}>
                <p>waiting on search</p>
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
