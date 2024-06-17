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
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init());

    #[cfg(not(debug_assertions))]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init());

    let invoke_handler = {
        let tauri_specta_builder =
            tauri_specta::ts::builder().commands(tauri_specta::collect_commands![get_dir_data]);

        #[cfg(debug_assertions)]
        let tauri_specta_builder = tauri_specta_builder.path("../src/commands.ts");

        tauri_specta_builder.build().unwrap()
    };

    #[cfg(debug_assertions)]
    {
        let devtools = tauri_plugin_devtools::init();
        builder = builder.plugin(devtools);
    }

    builder
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(invoke_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
