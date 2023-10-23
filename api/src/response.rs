use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct EthBalance {
    pub balance: String,
    pub unit_price_in_usd: String,
    pub network: String,
}

impl EthBalance {
    pub fn default() -> Self {
        EthBalance {
            balance: String::new(),
            unit_price_in_usd: String::new(),
            network: String::from("l1-bob"),
        }
    }
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct BtcBalance {
    pub ticker: String,
    pub balance: String,
    pub unit_price_in_usd: String,
    pub network: String,
    pub decimals: String,
}

impl BtcBalance {
    pub fn new(balance: String, unit_price_in_usd: String) -> Self {
        BtcBalance {
            ticker: "btc".to_string(),
            balance,
            unit_price_in_usd,
            network: String::from("mainnet"),
            decimals: "8".to_string(),
        }
    }

    pub fn for_brc20(ticker: String, balance: String, unit_price_in_usd: String) -> Self {
        BtcBalance {
            ticker,
            balance,
            unit_price_in_usd,
            network: String::from("mainnet"),
            decimals: "0".to_string(),
        }
    }

    pub fn default() -> Self {
        BtcBalance {
            ticker: "".to_string(),
            balance: String::new(),
            unit_price_in_usd: String::new(),
            network: String::from("mainnet"),
            decimals: "".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenInfo {
    pub balance: String,
    pub contract_address: String,
    pub decimals: String,
    pub name: String,
    pub symbol: String,
    pub token_type: String,
    pub unit_price_in_usd: String,
}
