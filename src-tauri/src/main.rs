// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

/**
 * @TODO
 * figure out how to only show logs in dev without
 * commenting out code before push.
 */
mod error;

// use log::info;
use error::Error;
use fs_extra::dir;
use nmw::FolderStat;
use rayon::prelude::*;
use specta::collect_types;
use tauri_specta::ts;
use tokio::sync::oneshot;

// use tauri_plugin_log::LogTarget;

#[tauri::command]
#[specta::specta]
async fn get_dir_data(pattern: &str) -> Result<Vec<FolderStat>, Error> {
    let (tx, rx) = oneshot::channel::<Vec<FolderStat>>();
    let dirs = nmw::get_dir_names(pattern);
    let mut result = vec![];

    // info!("get dir data starting");

    dirs.into_par_iter()
        .map(|path: String| {
            let size: u32 = dir::get_size(&path)
                .expect("file size")
                .try_into()
                .expect("not really sure");
            FolderStat { path, size }
        })
        .collect_into_vec(&mut result);

    tx.send(result).expect("File data did not reach receiver.");

    // info!("finished measuring directories");

    Ok(nmw::order_list(rx.await?))
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
