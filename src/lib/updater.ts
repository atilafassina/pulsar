import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export async function checkForAppUpdates(onUserClick: false) {
  const update = await check();
  if (update === null) {
    await message(
      `
Failed to check for updates.
Please try again later.
`,
      {
        title: "Error",
        kind: "error",
        okLabel: "OK",
      }
    );
    return;
  } else if (update?.available) {
    const yes = await ask(
      `
Update to ${update.version} is available!
Release notes: ${update.body}
        `,
      {
        title: "Update Now!",
        kind: "info",
        okLabel: "Update",
        cancelLabel: "Cancel",
      }
    );

    if (yes) {
      await update.downloadAndInstall();
      // Restart the app after the update is installed by calling the Tauri command that handles restart for your app
      // It is good practice to shut down any background processes gracefully before restarting
      // As an alternative, you could ask the user to restart the app manually
      await invoke("graceful_restart");
    }
  } else if (onUserClick) {
    await message("You are on the latest version.", {
      title: "No Update Found",
      kind: "info",
      okLabel: "OK",
    });
  }
}
