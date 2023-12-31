// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

/**
 * @TODO
 * figure out how to only show logs in dev without
 * commenting out code before push.
 */
mod error;
mod util;

use std::path::Path;
// use log::info;
use error::Error;
use futures::future::try_join_all;
use specta::collect_types;
use tauri_specta::ts;
use util::FolderStat;

// use tauri_plugin_log::LogTarget;

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

fn main() {
    #[cfg(debug_assertions)]
    ts::export(collect_types![get_dir_data], "../src/commands.ts").unwrap();

    tauri::Builder::default()
        // .plugin(
        //     tauri_plugin_log::Builder::default()
        //         .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
        //         .build(),
        // )
        .invoke_handler(tauri::generate_handler![get_dir_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
