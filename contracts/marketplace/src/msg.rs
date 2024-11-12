use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub ul_nft_contract: String,
    pub fee_percentage: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    ListNFT { token_id: String, price: Uint128 },
    CancelListing { token_id: String },
    BuyNFT { token_id: String },
    UpdateFee { fee_percentage: u64 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetListing {
        token_id: String,
    },
    GetListings {
        start_after: Option<String>,
        limit: Option<u32>,
    },
    GetConfig {},
}
