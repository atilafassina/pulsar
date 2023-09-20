function SafeLink({ href, text }: { href: string; text: string }) {
  return (
    <a class="text-neutral-300" href={href} target="_blank" rel="noopener">
      {text}
    </a>
  );
}
export default function Footer() {
  return (
    <footer class="flex justify-between py-3 px-10 bg-neutral-900 bg-opacity-60 text-neutral-400">
      <span>
        Built with <SafeLink href="http://tauri.app" text="Tauri" /> at{" "}
        <SafeLink href="https://crabnebula.dev" text="CrabNebula" />
      </span>
      <nav>
        <ul class="flex flex-row gap-4 font-mono">
          <li>
            <SafeLink href="" text="source" />
          </li>
          <li>
            <SafeLink href="https://atila.io" text="atila.io" />
          </li>
        </ul>
      </nav>
    </footer>
  );
}
