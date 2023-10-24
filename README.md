# Pulsar

Dependency scanner.

<div align="center">
    <img width="800" src="/docs/pulsar-screenshot.png" alt="screenshot of the results table at Pulsar"/>
</div>

> ⚠️ This project is still in Beta. Bugs are expected, please run it in a controlled environment.

## Run Locally 🦀

You need [Rust](https://www.rust-lang.org/tools/install) and [PNPM](https://pnpm.io) to run this project. Once the system is setup, you can clone this repository:

```sh
git clone --depth 1 https://github.com/atilafassina/pulsar
```

Change directory inside the project, install dependencies, and run development server.

```sh
cd pulsar && pnpm install && pnpm tauri dev
```

> 💡 Tauri will run the Vite dev server and then trigger the Rust build. First Rust build takes a little longer, but should still be less than a minute.

## Workspace Extensions 🧰

- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Build Your Own App 🔥

If you like this SolidJS + Tauri + TailwindCSS setup, this project is built upon my template: [create-solidjs-tailwind-tauri](https://github.com/atilafassina/create-solidjs-tailwind-tauri).
