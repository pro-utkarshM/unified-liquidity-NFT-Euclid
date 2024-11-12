use cosmwasm_std::{
    entry_point, to_json_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError,
    StdResult, Uint128,
};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// Contract state and configuration
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

// State storage
const CONFIG: Item<Config> = Item::new("config");
const TOKENS: Map<&str, TokenInfo> = Map::new("tokens");
const TOTAL_SUPPLY: Item<u64> = Item::new("total_supply");
const OWNER_TOKENS: Map<&Addr, Vec<String>> = Map::new("owner_tokens");

// Messages
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

// Contract instantiation
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    // Validate addresses
    let euclid_router = deps.api.addr_validate(&msg.euclid_router)?;

    // Create and store config
    let config = Config {
        name: msg.name,
        symbol: msg.symbol,
        admin: info.sender.clone(),
        euclid_router,
    };
    CONFIG.save(deps.storage, &config)?;

    // Initialize total supply
    TOTAL_SUPPLY.save(deps.storage, &0u64)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

// Execute entry point
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Mint {
            positions,
            token_uri,
        } => execute_mint(deps, env, info, positions, token_uri),
        ExecuteMsg::Transfer {
            recipient,
            token_id,
        } => execute_transfer(deps, env, info, recipient, token_id),
        ExecuteMsg::Approve { spender, token_id } => {
            execute_approve(deps, env, info, spender, token_id)
        }
        ExecuteMsg::Burn { token_id } => execute_burn(deps, env, info, token_id),
        ExecuteMsg::UpdateLiquidityPosition {
            token_id,
            position_updates,
        } => execute_update_position(deps, env, info, token_id, position_updates),
    }
}

// Query entry point
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetToken { token_id } => to_json_binary(&query_token(deps, token_id)?),
        QueryMsg::GetTokensByOwner { owner } => to_json_binary(&query_tokens_by_owner(deps, owner)?),
        QueryMsg::Config {} => to_json_binary(&CONFIG.load(deps.storage)?),
        QueryMsg::TotalSupply {} => to_json_binary(&TOTAL_SUPPLY.load(deps.storage)?),
    }
}

// Execute functions implementation
pub fn execute_mint(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    positions: Vec<LiquidityPosition>,
    token_uri: Option<String>,
) -> StdResult<Response> {
    // Load config and total supply
    let mut total_supply = TOTAL_SUPPLY.load(deps.storage)?;

    // Generate new token ID
    total_supply += 1;
    let token_id = format!("ulnft{}", total_supply);

    // Create token info
    let token = TokenInfo {
        owner: info.sender.clone(),
        positions,
        approved: None,
        token_uri,
    };

    // Update storage
    TOKENS.save(deps.storage, &token_id, &token)?;
    TOTAL_SUPPLY.save(deps.storage, &total_supply)?;

    // Update owner tokens
    let mut owner_tokens = OWNER_TOKENS
        .may_load(deps.storage, &info.sender)?
        .unwrap_or_default();
    owner_tokens.push(token_id.clone());
    OWNER_TOKENS.save(deps.storage, &info.sender, &owner_tokens)?;

    Ok(Response::new()
        .add_attribute("action", "mint")
        .add_attribute("token_id", token_id)
        .add_attribute("owner", info.sender))
}

pub fn execute_transfer(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    recipient: String,
    token_id: String,
) -> StdResult<Response> {
    let recipient = deps.api.addr_validate(&recipient)?;

    // Load and validate token
    let mut token = TOKENS.load(deps.storage, &token_id)?;
    if token.owner != info.sender {
        return Err(StdError::generic_err("Unauthorized"));
    }

    // Update owner tokens lists
    let mut old_owner_tokens = OWNER_TOKENS.load(deps.storage, &info.sender)?;
    old_owner_tokens.retain(|t| t != &token_id);
    OWNER_TOKENS.save(deps.storage, &info.sender, &old_owner_tokens)?;

    let mut new_owner_tokens = OWNER_TOKENS
        .may_load(deps.storage, &recipient)?
        .unwrap_or_default();
    new_owner_tokens.push(token_id.clone());
    OWNER_TOKENS.save(deps.storage, &recipient, &new_owner_tokens)?;

    // Update token owner
    token.owner = recipient.clone();
    token.approved = None;
    TOKENS.save(deps.storage, &token_id, &token)?;

    Ok(Response::new()
        .add_attribute("action", "transfer")
        .add_attribute("token_id", token_id)
        .add_attribute("from", info.sender)
        .add_attribute("to", recipient))
}

pub fn execute_update_position(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    token_id: String,
    position_updates: Vec<LiquidityPosition>,
) -> StdResult<Response> {
    // Load and validate token
    let mut token = TOKENS.load(deps.storage, &token_id)?;
    if token.owner != info.sender {
        return Err(StdError::generic_err("Unauthorized"));
    }

    // Update positions
    token.positions = position_updates;
    TOKENS.save(deps.storage, &token_id, &token)?;

    Ok(Response::new()
        .add_attribute("action", "update_position")
        .add_attribute("token_id", token_id))
}

// Query functions implementation
fn query_token(deps: Deps, token_id: String) -> StdResult<TokenInfo> {
    TOKENS.load(deps.storage, &token_id)
}

fn query_tokens_by_owner(deps: Deps, owner: String) -> StdResult<Vec<String>> {
    let owner = deps.api.addr_validate(&owner)?;
    Ok(OWNER_TOKENS
        .may_load(deps.storage, &owner)?
        .unwrap_or_default())
}

pub fn execute_approve(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    spender: String,
    token_id: String,
) -> StdResult<Response> {
    let spender_addr = deps.api.addr_validate(&spender)?;

    // Load and validate token
    let mut token = TOKENS.load(deps.storage, &token_id)?;
    if token.owner != info.sender {
        return Err(StdError::generic_err("Unauthorized"));
    }

    // Set approval
    token.approved = Some(spender_addr.clone());
    TOKENS.save(deps.storage, &token_id, &token)?;

    Ok(Response::new()
        .add_attribute("action", "approve")
        .add_attribute("token_id", token_id)
        .add_attribute("spender", spender))
}

pub fn execute_burn(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    token_id: String,
) -> StdResult<Response> {
    // Load and validate token
    let token = TOKENS.load(deps.storage, &token_id)?;
    if token.owner != info.sender {
        return Err(StdError::generic_err("Unauthorized"));
    }

    // Remove token
    TOKENS.remove(deps.storage, &token_id);

    // Update owner tokens
    let mut owner_tokens = OWNER_TOKENS.load(deps.storage, &info.sender)?;
    owner_tokens.retain(|t| t != &token_id);
    OWNER_TOKENS.save(deps.storage, &info.sender, &owner_tokens)?;

    // Update total supply
    let mut total_supply = TOTAL_SUPPLY.load(deps.storage)?;
    total_supply -= 1;
    TOTAL_SUPPLY.save(deps.storage, &total_supply)?;

    Ok(Response::new()
        .add_attribute("action", "burn")
        .add_attribute("token_id", token_id))
}
