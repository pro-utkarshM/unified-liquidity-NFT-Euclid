use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::state::{Config, LiquidityPosition, TokenInfo};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MigrateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub name: String,
    pub symbol: String,
    pub euclid_router: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Mint {
        positions: Vec<LiquidityPosition>,
        token_uri: Option<String>,
    },
    Transfer {
        recipient: String,
        token_id: String,
    },
    Approve {
        spender: String,
        token_id: String,
    },
    Burn {
        token_id: String,
    },
    UpdateLiquidityPosition {
        token_id: String,
        position_updates: Vec<LiquidityPosition>,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetToken { token_id: String },
    GetTokensByOwner { owner: String },
    Config {},
    TotalSupply {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetTokenResponse {
    pub token: TokenInfo,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetTokensByOwnerResponse {
    pub tokens: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ConfigResponse {
    pub config: Config,
}
