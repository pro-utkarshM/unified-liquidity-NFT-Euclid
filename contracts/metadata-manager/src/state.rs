use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub ul_nft_contract: Addr,
    pub updater_addresses: Vec<Addr>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TokenMetadata {
    pub name: String,
    pub description: String,
    pub image: Option<String>,
    pub external_url: Option<String>,
    pub attributes: Vec<Attribute>,
    pub animation_url: Option<String>,
    pub background_color: Option<String>,
    pub last_updated: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Attribute {
    pub trait_type: String,
    pub value: String,
    pub display_type: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PoolStats {
    pub total_liquidity: Uint128,
    pub volume_24h: Uint128,
    pub fees_earned: Uint128,
    pub apy: String,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const METADATA: Map<&str, TokenMetadata> = Map::new("metadata");
pub const POOL_STATS: Map<&str, PoolStats> = Map::new("pool_stats");
