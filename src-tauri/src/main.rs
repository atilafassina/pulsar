// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;

use error::Error;
use fs_extra::dir::{self};
use rayon::prelude::*;
use tokio::sync::oneshot;

#[tauri::command]
async fn get_dir_data(pattern: &str) -> Result<Vec<(String, u64)>, Error> {
    let (tx, rx) = oneshot::channel::<Vec<(String, u64)>>();
    let files = nmw::get_file_names(pattern);

    let result = files
        .into_par_iter()
        .map(|file_path: String| {
            let size = dir::get_size(&file_path).expect("file size");
            (file_path, size)
        })
        .collect();

    tx.send(result).expect("File data did not reach receiver.");

    Ok(nmw::order_list(rx.await?))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dir_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
