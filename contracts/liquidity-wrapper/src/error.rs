use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid Euclid Router address")]
    InvalidEuclidRouter {},

    #[error("Invalid Euclid Factory address")]
    InvalidEuclidFactory {},

    #[error("Position not found")]
    PositionNotFound {},

    #[error("Pool not found")]
    PoolNotFound {},

    #[error("Invalid position amount")]
    InvalidPositionAmount {},

    #[error("Invalid token pair")]
    InvalidTokenPair {},

    #[error("Chain not supported")]
    ChainNotSupported {},

    #[error("Operation pending")]
    OperationPending {},

    #[error("Cross chain operation failed")]
    CrossChainOperationFailed {},

    #[error("Insufficient liquidity")]
    InsufficientLiquidity {},

    #[error("Position locked")]
    PositionLocked {},
}
