use crate::state::LiquidityPosition;
use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub ul_nft_contract: String,
    pub euclid_router: String,
    pub euclid_factory: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // Add liquidity to Euclid pool
    AddLiquidity {
        pool_id: String,
        chain_id: String,
        token_pair: (String, String),
        amount: Uint128,
        min_shares: Uint128,
    },
    // Remove liquidity from Euclid pool
    RemoveLiquidity {
        token_id: String,
        amount: Option<Uint128>, // If None, removes all liquidity
    },
    // Transfer position between chains
    TransferPosition {
        token_id: String,
        to_chain_id: String,
    },
    // Update position (rebalance or adjust)
    UpdatePosition {
        token_id: String,
        new_amount: Uint128,
    },
    // Claim rewards from liquidity provision
    ClaimRewards {
        token_id: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // Get config information
    GetConfig {},
    // Get position information by token ID
    GetPosition { token_id: String },
    // Get all positions for a pool
    GetPoolPositions { pool_id: String },
    // Get pending operations
    GetPendingOperations { token_id: String },
    // Get total liquidity in a pool
    GetPoolLiquidity { pool_id: String },
    // Estimate rewards for a position
    EstimateRewards { token_id: String },
}

// Message for communication with Euclid Protocol
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct EuclidMsg {
    pub action: EuclidAction,
    pub data: Binary,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum EuclidAction {
    AddLiquidity,
    RemoveLiquidity,
    SwapExactIn,
    SwapExactOut,
    TransferLiquidity,
    ClaimRewards,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct EuclidResponse {
    pub success: bool,
    pub data: Binary,
    pub error: Option<String>,
}
