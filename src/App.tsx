import { Show, createSignal } from "solid-js";
import { Logo } from "./components/logo";
import { Scanner } from "./components/scanner";
import Footer from "./components/footer";
import ResultsList from "./components/results-list";
import "./App.css";
import { scanStore } from "./lib/store";

function App() {
  const [scanData, setScanData] = scanStore;

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
          <ResultsList folderList={scanData.fileList} />
        </article>
        <Footer />
      </main>
    </>
  );
}

export default App;
