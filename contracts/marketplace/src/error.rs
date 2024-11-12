use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("NFT not listed")]
    NotListed {},

    #[error("NFT already listed")]
    AlreadyListed {},

    #[error("Invalid price")]
    InvalidPrice {},

    #[error("Insufficient funds")]
    InsufficientFunds {},

    #[error("Invalid fee percentage")]
    InvalidFeePercentage {},
}
