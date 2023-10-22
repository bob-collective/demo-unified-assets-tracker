use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct EthBalance {
    pub balance: String,
    pub balance_in_usd: String,
    pub network: String,
}

impl EthBalance {
    pub fn default() -> Self {
        EthBalance {
            balance: String::new(),
            balance_in_usd: String::new(),
            network: String::from("l1-bob"),
        }
    }
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct BtcBalance {
    pub ticker: String,
    pub balance: String,
    pub balance_in_usd: String,
    pub network: String,
}

impl BtcBalance {
    pub fn new(balance: String,balance_in_usd:String ) -> Self {
        BtcBalance {
            ticker: "100000000".to_string(),
            balance,
            balance_in_usd,
            network: String::from("testnet"),
        }
    }
    pub fn default() -> Self {
        BtcBalance {
            ticker: "100000000".to_string(),
            balance: String::new(),
            balance_in_usd: String::new(),
            network: String::from("testnet"),
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
    pub balance_in_usd: String,
}
