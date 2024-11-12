use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Token not found")]
    TokenNotFound {},

    #[error("Pool not found")]
    PoolNotFound {},

    #[error("Invalid metadata")]
    InvalidMetadata {},

    #[error("Invalid attribute")]
    InvalidAttribute {},

    #[error("Duplicate attribute")]
    DuplicateAttribute {},

    #[error("Updater already exists")]
    UpdaterExists {},

    #[error("Updater not found")]
    UpdaterNotFound {},

    #[error("Cannot remove the last updater")]
    CannotRemoveLastUpdater {},

    #[error("Duplicate updater address")]
    DuplicateUpdater {},
}
