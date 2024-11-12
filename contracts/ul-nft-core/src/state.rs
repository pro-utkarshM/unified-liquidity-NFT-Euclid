use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub name: String,
    pub symbol: String,
    pub admin: Addr,
    pub euclid_router: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct LiquidityPosition {
    pub pool_id: String,
    pub token_pair: (String, String),
    pub amount: Uint128,
    pub chain_id: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TokenInfo {
    pub owner: Addr,
    pub positions: Vec<LiquidityPosition>,
    pub approved: Option<Addr>,
    pub token_uri: Option<String>,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const TOKENS: Map<&str, TokenInfo> = Map::new("tokens");
pub const TOTAL_SUPPLY: Item<u64> = Item::new("total_supply");
pub const OWNER_TOKENS: Map<&Addr, Vec<String>> = Map::new("owner_tokens");
