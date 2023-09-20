import { createSignal } from "solid-js";
import "./App.css";
import { Header } from "./components/header";
import { Scanner } from "./components/scanner";
import Footer from "./components/footer";
import ResultsList from "./components/results-list";

const all_documents = "../../../*/*/node_modules";
// const only_atila = "../../*/node_modules";
// const only_crab = "../../../crab/*/node_modules";
// const REGEX = "/(.*?)/node_modules";
// const REGEX = /\/([^/]+)\/node_modules$/;

function App() {
  const [globPattern, setGlobPattern] = createSignal(all_documents);
  const [folderList, setFolderList] = createSignal([
    { path: "../../crab/crabnebula.dev/node_modules", size: 20949875732 },
  ]);

  return (
    <>
      <main class="grid min-h-screen bg-neutral-800 bg-opacity-60 text-white grid-rows-[auto,1fr,auto]">
        <header class="pt-5 px-10 w-full flex justify-between items-center gap-28">
          <Header />
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
