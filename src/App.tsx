import { createSignal } from "solid-js";
import { Logo } from "./components/logo";
import { Scanner } from "./components/scanner";
import Footer from "./components/footer";
import ResultsList from "./components/results-list";
import "./App.css";

const all_documents = "../../../*/*/node_modules";

function App() {
  const [globPattern, setGlobPattern] = createSignal(all_documents);
  const [folderList, setFolderList] = createSignal([]);

  return (
    <>
      <main class="grid min-h-screen bg-neutral-800 bg-opacity-60 text-white grid-rows-[auto,1fr,auto]">
        <header class="pt-5 px-10 w-full flex sm:flex-row flex-col sm:justify-between items-center gap-6 sm:gap-28">
          <Logo />
          <Scanner
            pattern={globPattern()}
            setPattern={setGlobPattern}
            setList={setFolderList}
          />
        </header>
        <article class="px-10">
          <ResultsList folderList={folderList} />
        </article>
        <Footer />
      </main>
    </>
  );
}

export default App;
