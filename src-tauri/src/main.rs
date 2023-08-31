// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;

use error::Error;
use fs_extra::dir::{self};
use nmw::FolderStat;
use rayon::prelude::*;
use specta::collect_types;
use tauri_specta::ts;
use tokio::sync::oneshot;

#[tauri::command]
#[specta::specta]
async fn get_dir_data(pattern: &str) -> Result<Vec<FolderStat>, Error> {
    let (tx, rx) = oneshot::channel::<Vec<FolderStat>>();
    let files = nmw::get_file_names(pattern);
    let mut result = vec![];

    files
        .into_par_iter()
        .map(|path: String| {
            let size: u32 = dir::get_size(&path).expect("file size").try_into().unwrap();
            FolderStat { path, size }
        })
        .collect_into_vec(&mut result);

    tx.send(result).expect("File data did not reach receiver.");

    Ok(nmw::order_list(rx.await?))
}

fn main() {
    #[cfg(debug_assertions)]
    ts::export(collect_types![get_dir_data], "../src/commands.ts").unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dir_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
