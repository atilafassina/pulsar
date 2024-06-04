use crate::FolderStat;
use serde::{Serialize, Serializer};
use specta::Type;

#[derive(Debug, Type, thiserror::Error)]
#[serde(tag = "type", content = "data")]
pub enum Error {
    #[serde(skip)]
    #[error("Tokio can't readdir")]
    IoError(
        #[serde(skip)] // io::Error is not `Serialize` or `Type`
        #[from]
        std::io::Error,
    ),

    #[error("Failed to forward folder statistics, internal channel is broken.")]
    #[serde(skip)]
    TrySendError(#[from] tokio::sync::mpsc::error::TrySendError<FolderStat>),

    #[error("Node modules folder size too large to be represented in JavaScript.")]
    TooLarge(
        #[serde(skip)] // io::Error is not `Serialize` or `Type`
        #[from]
        std::num::TryFromIntError,
    ),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
