use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Token not found")]
    TokenNotFound {},

    #[error("Cannot set approval for own account")]
    CannotSetApprovalForOwnAccount {},

    #[error("Invalid token ID")]
    InvalidTokenId {},

    #[error("Invalid liquidity position")]
    InvalidLiquidityPosition {},

    #[error("Token already minted")]
    TokenAlreadyExists {},

    #[error("Invalid Euclid router address")]
    InvalidEuclidRouter {},
}
