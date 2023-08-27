mod error;

use glob::{glob_with, MatchOptions};
use std::path::Path;

use core::future::Future;
use core::pin::Pin;

pub fn get_size<'a>(path: &'a Path) -> Pin<Box<dyn Future<Output = u64> + 'a>> {
    Box::pin(async move {
        // Using `fs::symlink_metadata` since we don't want to follow symlinks,
        // as we're calculating the exact size of the requested path itself.
        let path_metadata = tokio::fs::symlink_metadata(&path).await.unwrap();
        let mut size_in_bytes = 0;

        if path_metadata.is_dir() {
            let mut read_dir = tokio::fs::read_dir(&path).await.unwrap();

            while let Some(entry) = read_dir.next_entry().await.unwrap() {
                // `DirEntry::metadata` does not follow symlinks (unlike `fs::metadata`), so in the
                // case of symlinks, this is the size of the symlink itself, not its target.
                let entry_metadata = entry.metadata().await.unwrap();

                if entry_metadata.is_dir() {
                    // The size of the directory entry itself will be counted inside the `get_size()` call,
                    // so we intentionally don't also add `entry_metadata.len()` to the total here.
                    size_in_bytes += get_size(&entry.path()).await;
                } else {
                    size_in_bytes += entry_metadata.len();
                }
            }
        } else {
            size_in_bytes = path_metadata.len();
        }
        size_in_bytes
    })
}

pub fn get_file_names(path: &str) -> Vec<String> {
    let mut filenames: Vec<String> = Vec::new();

    for entry in glob_with(path, MatchOptions::default()).expect("glob has no files") {
        if let Ok(path) = entry {
            filenames.push(path.display().to_string());
        }
    }

    filenames
}
