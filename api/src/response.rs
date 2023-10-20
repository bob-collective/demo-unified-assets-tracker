use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct EthBalance {
    pub balance: String,
    pub balance_in_usd: String,
    pub network: String,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct BtcBalance {
    pub ticker: String,
    pub balance: String,
    pub balance_in_usd: String,
    pub network: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenInfo {
    pub balance: String,
    pub contract_address: String,
    pub decimals: String,
    pub name: String,
    pub symbol: String,
    pub token_type: String,
    pub balance_in_usd: String,
}
