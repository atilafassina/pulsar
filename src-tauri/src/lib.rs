mod error;
mod util;

use error::Error;
use futures::future::try_join_all;
// use specta::collect_types;
use std::path::Path;
use tauri_plugin_devtools;
// use tauri_specta::ts;
use util::FolderStat;

// #[specta::specta]
#[tauri::command]
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
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init());

    #[cfg(debug_assertions)]
    {
        let devtools = tauri_plugin_devtools::init();
        // ts::export(collect_types![get_dir_data], "../src/commands.ts").unwrap();

        builder = builder.plugin(devtools);
    }

    builder
        .invoke_handler(tauri::generate_handler![get_dir_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
