use crate::state::{Attribute, PoolStats, TokenMetadata};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub ul_nft_contract: String,
    pub updater_addresses: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    UpdateMetadata {
        token_id: String,
        metadata: TokenMetadata,
    },
    AddAttribute {
        token_id: String,
        attribute: Attribute,
    },
    RemoveAttribute {
        token_id: String,
        trait_type: String,
    },
    UpdatePoolStats {
        pool_id: String,
        stats: PoolStats,
    },
    AddUpdater {
        address: String,
    },
    RemoveUpdater {
        address: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetMetadata { token_id: String },
    GetPoolStats { pool_id: String },
    GetConfig {},
    GetUpdaters {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetMetadataResponse {
    pub token_id: String,
    pub metadata: TokenMetadata,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetPoolStatsResponse {
    pub pool_id: String,
    pub stats: PoolStats,
}
