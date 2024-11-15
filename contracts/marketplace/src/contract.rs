use cosmwasm_std::{
    coins, to_json_binary, BankMsg, Binary, CosmosMsg, Deps, DepsMut, Env, MessageInfo, Order,
    Response, StdResult, Uint128, WasmMsg,
};
use cw2::set_contract_version;
use cw_storage_plus::Bound;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Config, ListingInfo, CONFIG, LISTINGS, SELLER_LISTINGS};

// Contract name and version for migration info
const CONTRACT_NAME: &str = "crates.io:marketplace";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), cosmwasm_std::entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // Validate fee percentage (must be between 0 and 10000 for 0% to 100%)
    if msg.fee_percentage > 10000 {
        return Err(ContractError::InvalidFeePercentage {});
    }

    let config = Config {
        admin: info.sender.clone(),
        ul_nft_contract: deps.api.addr_validate(&msg.ul_nft_contract)?,
        fee_percentage: msg.fee_percentage,
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender)
        .add_attribute("ul_nft_contract", msg.ul_nft_contract)
        .add_attribute("fee_percentage", msg.fee_percentage.to_string()))
}

#[cfg_attr(not(feature = "library"), cosmwasm_std::entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::ListNFT { token_id, price } => {
            execute_list_nft(deps, env, info, token_id, price)
        }
        ExecuteMsg::CancelListing { token_id } => execute_cancel_listing(deps, env, info, token_id),
        ExecuteMsg::BuyNFT { token_id } => execute_buy_nft(deps, env, info, token_id),
        ExecuteMsg::UpdateFee { fee_percentage } => execute_update_fee(deps, info, fee_percentage),
    }
}

pub fn execute_list_nft(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    token_id: String,
    price: Uint128,
) -> Result<Response, ContractError> {
    // Validate price is not zero
    if price.is_zero() {
        return Err(ContractError::InvalidPrice {});
    }

    // Check if NFT is already listed
    if LISTINGS.has(deps.storage, &token_id) {
        return Err(ContractError::AlreadyListed {});
    }

    // Create listing
    let listing = ListingInfo {
        seller: info.sender.clone(),
        token_id: token_id.clone(),
        price,
        listing_time: env.block.time.seconds(),
    };

    // Save listing
    LISTINGS.save(deps.storage, &token_id, &listing)?;

    // Update seller's listings
    let mut seller_listings = SELLER_LISTINGS
        .may_load(deps.storage, &info.sender)?
        .unwrap_or_default();
    seller_listings.push(token_id.clone());
    SELLER_LISTINGS.save(deps.storage, &info.sender, &seller_listings)?;

    Ok(Response::new()
        .add_attribute("method", "list_nft")
        .add_attribute("token_id", token_id)
        .add_attribute("price", price)
        .add_attribute("seller", info.sender))
}

pub fn execute_cancel_listing(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    token_id: String,
) -> Result<Response, ContractError> {
    let listing = LISTINGS.load(deps.storage, &token_id)?;

    // Verify sender is the seller
    if listing.seller != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    // Remove listing
    LISTINGS.remove(deps.storage, &token_id);

    // Update seller's listings
    let mut seller_listings = SELLER_LISTINGS.load(deps.storage, &info.sender)?;
    seller_listings.retain(|id| id != &token_id);
    SELLER_LISTINGS.save(deps.storage, &info.sender, &seller_listings)?;

    Ok(Response::new()
        .add_attribute("method", "cancel_listing")
        .add_attribute("token_id", token_id))
}

pub fn execute_buy_nft(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    token_id: String,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let listing = LISTINGS.load(deps.storage, &token_id)?;

    // Check if enough funds were sent
    let payment = info
        .funds
        .iter()
        .find(|coin| coin.denom == "uarch")
        .ok_or(ContractError::InsufficientFunds {})?;

    if payment.amount < listing.price {
        return Err(ContractError::InsufficientFunds {});
    }

    // Calculate fees
    let fee_amount = listing
        .price
        .multiply_ratio(config.fee_percentage, 10000u128);
    let seller_amount = listing.price - fee_amount;

    // Remove listing
    LISTINGS.remove(deps.storage, &token_id);

    // Update seller's listings
    let mut seller_listings = SELLER_LISTINGS.load(deps.storage, &listing.seller)?;
    seller_listings.retain(|id| id != &token_id);
    SELLER_LISTINGS.save(deps.storage, &listing.seller, &seller_listings)?;

    // Create transfer NFT message
    let transfer_nft_msg = WasmMsg::Execute {
        contract_addr: config.ul_nft_contract.to_string(),
        msg: to_json_binary(&cw721::Cw721ExecuteMsg::TransferNft {
            recipient: info.sender.to_string(),
            token_id: token_id.clone(),
        })?,
        funds: vec![],
    };

    // Create bank messages for payment
    let mut messages: Vec<CosmosMsg> = vec![transfer_nft_msg.into()];

    // Send payment to seller
    if !seller_amount.is_zero() {
        messages.push(
            BankMsg::Send {
                to_address: listing.seller.to_string(),
                amount: coins(seller_amount.u128(), "uarch"),
            }
            .into(),
        );
    }

    // Send fee to admin
    if !fee_amount.is_zero() {
        messages.push(
            BankMsg::Send {
                to_address: config.admin.to_string(),
                amount: coins(fee_amount.u128(), "uarch"),
            }
            .into(),
        );
    }

    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "buy_nft")
        .add_attribute("token_id", token_id)
        .add_attribute("buyer", info.sender)
        .add_attribute("seller", listing.seller)
        .add_attribute("price", listing.price)
        .add_attribute("fee_amount", fee_amount))
}

pub fn execute_update_fee(
    deps: DepsMut,
    info: MessageInfo,
    fee_percentage: u64,
) -> Result<Response, ContractError> {
    // Only admin can update fee
    let mut config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }

    // Validate new fee percentage
    if fee_percentage > 10000 {
        return Err(ContractError::InvalidFeePercentage {});
    }

    config.fee_percentage = fee_percentage;
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("method", "update_fee")
        .add_attribute("new_fee_percentage", fee_percentage.to_string()))
}

#[cfg_attr(not(feature = "library"), cosmwasm_std::entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetListing { token_id } => to_json_binary(&query_listing(deps, token_id)?),
        QueryMsg::GetListings { start_after, limit } => {
            to_json_binary(&query_listings(deps, start_after, limit)?)
        }
        QueryMsg::GetConfig {} => to_json_binary(&query_config(deps)?),
    }
}

fn query_listing(deps: Deps, token_id: String) -> StdResult<Option<ListingInfo>> {
    LISTINGS.may_load(deps.storage, &token_id)
}

fn query_listings(
    deps: Deps,
    start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<Vec<ListingInfo>> {
    let limit = limit.unwrap_or(30) as usize;
    let start = start_after.as_deref().map(Bound::exclusive);

    LISTINGS
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|item| {
            let (_, listing) = item?;
            Ok(listing)
        })
        .collect()
}

fn query_config(deps: Deps) -> StdResult<Config> {
    CONFIG.load(deps.storage)
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();
        let info = mock_info("creator", &[]);
        let msg = InstantiateMsg {
            ul_nft_contract: "nft_contract".to_string(),
            fee_percentage: 250, // 2.5%
        };

        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // Query the config
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetConfig {}).unwrap();
        let config: Config = from_json(&res).unwrap();
        assert_eq!(config.fee_percentage, 250);
    }

    // To Add more tests as needed...
}
