use cosmwasm_std::{
    attr, entry_point, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Order, Response,
    StdResult,
};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Attribute, Config, PoolStats, TokenMetadata, CONFIG, METADATA, POOL_STATS};

const CONTRACT_NAME: &str = "crates.io:metadata-manager";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let mut updater_addresses = vec![info.sender.clone()];

    // Validate and add additional updater addresses
    for addr in msg.updater_addresses {
        let validated_addr = deps.api.addr_validate(&addr)?;
        if !updater_addresses.contains(&validated_addr) {
            updater_addresses.push(validated_addr);
        }
    }

    let config = Config {
        admin: info.sender.clone(),
        ul_nft_contract: deps.api.addr_validate(&msg.ul_nft_contract)?,
        updater_addresses,
    };

    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender)
        .add_attribute("ul_nft_contract", msg.ul_nft_contract))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::UpdateMetadata { token_id, metadata } => {
            execute_update_metadata(deps, env, info, token_id, metadata)
        }
        ExecuteMsg::AddAttribute {
            token_id,
            attribute,
        } => execute_add_attribute(deps, env, info, token_id, attribute),
        ExecuteMsg::RemoveAttribute {
            token_id,
            trait_type,
        } => execute_remove_attribute(deps, env, info, token_id, trait_type),
        ExecuteMsg::UpdatePoolStats { pool_id, stats } => {
            execute_update_pool_stats(deps, env, info, pool_id, stats)
        }
        ExecuteMsg::AddUpdater { address } => execute_add_updater(deps, info, address),
        ExecuteMsg::RemoveUpdater { address } => execute_remove_updater(deps, info, address),
    }
}

pub fn execute_update_metadata(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    token_id: String,
    mut metadata: TokenMetadata,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if !config.updater_addresses.contains(&info.sender) {
        return Err(ContractError::Unauthorized {});
    }

    metadata.last_updated = env.block.time.seconds();
    METADATA.save(deps.storage, &token_id, &metadata)?;

    Ok(Response::new()
        .add_attribute("action", "update_metadata")
        .add_attribute("token_id", token_id))
}

pub fn execute_add_attribute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    token_id: String,
    attribute: Attribute,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if !config.updater_addresses.contains(&info.sender) {
        return Err(ContractError::Unauthorized {});
    }

    METADATA.update(deps.storage, &token_id, |metadata_opt| -> StdResult<_> {
        let mut metadata = metadata_opt.ok_or_else(|| StdError::not_found("Token metadata"))?;

        // Check for duplicate trait_type
        if metadata
            .attributes
            .iter()
            .any(|attr| attr.trait_type == attribute.trait_type)
        {
            return Err(StdError::generic_err("Duplicate attribute trait_type"));
        }

        metadata.attributes.push(attribute.clone());
        metadata.last_updated = env.block.time.seconds();
        Ok(metadata)
    })?;

    Ok(Response::new()
        .add_attribute("action", "add_attribute")
        .add_attribute("token_id", token_id)
        .add_attribute("trait_type", attribute.trait_type))
}

pub fn execute_update_pool_stats(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    pool_id: String,
    stats: PoolStats,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if !config.updater_addresses.contains(&info.sender) {
        return Err(ContractError::Unauthorized {});
    }

    POOL_STATS.save(deps.storage, &pool_id, &stats)?;

    Ok(Response::new()
        .add_attribute("action", "update_pool_stats")
        .add_attribute("pool_id", pool_id))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetMetadata { token_id } => to_binary(&query_metadata(deps, token_id)?),
        QueryMsg::GetPoolStats { pool_id } => to_binary(&query_pool_stats(deps, pool_id)?),
        QueryMsg::GetConfig {} => to_binary(&CONFIG.load(deps.storage)?),
        QueryMsg::GetUpdaters {} => to_binary(&query_updaters(deps)?),
    }
}

fn query_metadata(deps: Deps, token_id: String) -> StdResult<TokenMetadata> {
    METADATA.load(deps.storage, &token_id)
}

fn query_pool_stats(deps: Deps, pool_id: String) -> StdResult<PoolStats> {
    POOL_STATS.load(deps.storage, &pool_id)
}

fn query_updaters(deps: Deps) -> StdResult<Vec<String>> {
    let config = CONFIG.load(deps.storage)?;
    Ok(config
        .updater_addresses
        .iter()
        .map(|addr| addr.to_string())
        .collect())
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();
        let info = mock_info("creator", &[]);
        let msg = InstantiateMsg {
            ul_nft_contract: "ul_nft".to_string(),
            updater_addresses: vec!["updater1".to_string()],
        };

        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // Query config
        let config = CONFIG.load(deps.as_ref().storage).unwrap();
        assert_eq!(config.ul_nft_contract, "ul_nft");
        assert_eq!(config.updater_addresses.len(), 2); // creator + updater1
    }
}
