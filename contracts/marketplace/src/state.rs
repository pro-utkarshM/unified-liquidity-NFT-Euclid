use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
    pub ul_nft_contract: Addr,
    pub fee_percentage: u64, // In basis points (1/100 of a percent)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ListingInfo {
    pub seller: Addr,
    pub token_id: String,
    pub price: Uint128,
    pub listing_time: u64,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const LISTINGS: Map<&str, ListingInfo> = Map::new("listings");
pub const SELLER_LISTINGS: Map<&Addr, Vec<String>> = Map::new("seller_listings");
