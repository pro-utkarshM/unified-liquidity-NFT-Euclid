use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub ul_nft_contract: Addr,
    pub euclid_router: Addr,
    pub euclid_factory: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct LiquidityPosition {
    pub pool_id: String,
    pub chain_id: String,
    pub token_pair: (String, String),
    pub amount: Uint128,
    pub last_updated: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PositionInfo {
    pub owner: Addr,
    pub token_id: String,
    pub position: LiquidityPosition,
}

// Store configuration
pub const CONFIG: Item<Config> = Item::new("config");

// Map token_id to position info
pub const POSITIONS: Map<&str, PositionInfo> = Map::new("positions");

// Map pool_id to total liquidity
pub const POOL_LIQUIDITY: Map<&str, Uint128> = Map::new("pool_liquidity");

// Store pending operations
pub const PENDING_OPERATIONS: Map<&str, Vec<String>> = Map::new("pending_operations");
