mod error;

use globwalk::GlobWalkerBuilder;
// use log::info;
use regex::Regex;
use std::path::Path;

use core::future::Future;
use core::pin::Pin;
use serde::Serialize;
use specta::Type;

#[derive(Serialize, Type, Debug)]
pub struct FolderStat {
    pub path: String,
    pub size: u32,
}

pub fn order_list(mut list: Vec<FolderStat>) -> Vec<FolderStat> {
    list.sort_by(|a, b| a.path.cmp(&b.path));
    list.sort_by(|a, b| b.size.cmp(&a.size));

    list
}

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

pub fn get_dir_names(path: &str) -> Vec<String> {
    let mut filenames: Vec<String> = Vec::new();

    let walker = GlobWalkerBuilder::from_patterns(path, &["**/node_modules", "**/![.pnpm]/*"])
        .max_depth(6)
        .follow_links(false)
        .build()
        .expect("glob walker should work")
        .into_iter()
        .filter_map(Result::ok);

    for file in walker {
        let path_string = file.path().display().to_string();
        let node_modules_regex = Regex::new(r"node_modules").unwrap();

        let mut count = 0;
        let mut start = 0;
        let mut should_scan = true;

        while let Some(mat) = node_modules_regex.captures(&path_string[start..]) {
            count += 1;
            start += mat.get(0).unwrap().end();

            if count > 1 {
                should_scan = false;
                break;
            }
        }

        if should_scan {
            filenames.push(path_string)
        }
    }

    // info!("{}", filenames.len());

    filenames
}
