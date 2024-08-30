mod error;
mod util;

use error::Error;
use futures::future::try_join_all;
use specta;
use std::path::Path;
use util::FolderStat;

#[cfg(debug_assertions)]
use tauri_plugin_devtools;
use tauri_plugin_dialog;

#[tauri::command]
#[specta::specta]
async fn get_dir_data(pattern: &str) -> Result<Vec<FolderStat>, Error> {
    let dirs = util::get_dir_names(Path::new(pattern));

    let iter = dirs.into_iter().map(|path| async move {
        let size = u32::try_from(util::get_size(&path).await?)?;
        Ok(FolderStat { path, size }) as Result<FolderStat, Error>
    });

    let result = try_join_all(iter).await?;

    Ok(util::order_list(result))
}

pub fn run() {
    #[cfg(debug_assertions)]
    let devtools = tauri_plugin_devtools::init();
    let builder = tauri::Builder::default().plugin(devtools);

    #[cfg(not(debug_assertions))]
    let builder = tauri::Builder::default();

    let specta_builder = tauri_specta::Builder::<tauri::Wry>::new()
        .commands(tauri_specta::collect_commands![get_dir_data]);

    #[cfg(all(debug_assertions, not(mobile)))]
    specta_builder
        .export(
            specta_typescript::Typescript::default()
                .formatter(specta_typescript::formatter::prettier),
            "../src/commands.ts",
        )
        .expect("failed to export typescript bindings");

    builder
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(specta_builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
