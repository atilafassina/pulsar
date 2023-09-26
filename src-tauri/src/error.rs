use crate::FolderStat;
use serde::{Serialize, Serializer};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Tokio can't readdir")]
    Io(#[from] std::io::Error),
    #[error("Failed to forward folder statistics, internal channel is broken.")]
    TrySendError(#[from] tokio::sync::mpsc::error::TrySendError<FolderStat>),
    #[error("Node modules folder size too large to be represented in JavaScript.")]
    TooLarge(#[from] std::num::TryFromIntError),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
