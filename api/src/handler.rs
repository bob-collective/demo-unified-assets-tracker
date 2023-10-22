use crate::response::{BtcBalance, EthBalance, TokenInfo};
use actix_web::{post, web, HttpResponse, Responder};
use num_bigint::BigUint;
use num_traits::Num;

#[post("/tokenbalancel2")]
async fn get_token_balance_on_l2(address: String) -> impl Responder {
    // Construct the complete URL
    let url = "https://explorerl2-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/api?module=account&action=tokenlist&address=".to_string() + &address;

    let mut vec = Vec::new();
    // Send an HTTP GET request
    if let Ok(response_result) = reqwest::get(&url).await {
        let http_response = HttpResponse::new(response_result.status());
        if http_response.error().is_some() {
            return http_response;
        }
        if let Ok(json_result) = response_result.json::<serde_json::Value>().await {
            for item in json_result["result"].as_array().unwrap_or(&vec![]) {
                let balance = &item["balance"];
                let contract_address = &item["contractAddress"];
                let decimals = &item["decimals"];
                let name = &item["name"];
                let symbol = &item["symbol"];
                let token_type = &item["type"];
                // add usd price as well

                let token_info: TokenInfo = TokenInfo {
                    balance: balance.to_string().replace("\"", ""),
                    contract_address: contract_address.to_string().replace("\"", ""),
                    decimals: decimals.to_string().replace("\"", ""),
                    name: name.to_string().replace("\"", ""),
                    symbol: symbol.to_string().replace("\"", ""),
                    token_type: token_type.to_string().replace("\"", ""),
                    balance_in_usd: String::new(),
                };
                vec.push(token_info);
            }
            return HttpResponse::Ok().json(vec);
        }
        return HttpResponse::InternalServerError().json("Serialization error");
    } else {
        return HttpResponse::NotFound().into();
    }
}

#[post("/tokenbalancel1")]
async fn get_token_balance_on_l1(address: String) -> impl Responder {
    // Construct the complete URL
    let url = "https://explorerl1-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/api?module=account&action=tokenlist&address=".to_string() + &address;

    let mut vec = Vec::new();
    // Send an HTTP GET request
    if let Ok(response_result) = reqwest::get(&url).await {
        let http_response = HttpResponse::new(response_result.status());
        if http_response.error().is_some() {
            return http_response;
        }
        // panic!("response: {:?}", response_result.json::<serde_json::Value>().await);
        if let Ok(json_result) = response_result.json::<serde_json::Value>().await {
            for item in json_result["result"].as_array().unwrap_or(&vec![]) {
                let balance = &item["balance"];
                let contract_address = &item["contractAddress"];
                let decimals = &item["decimals"];
                let name = &item["name"];
                let symbol = &item["symbol"];
                let token_type = &item["type"];
                // add usd price as well

                let token_info: TokenInfo = TokenInfo {
                    balance: balance.to_string().replace("\"", ""),
                    contract_address: contract_address.to_string().replace("\"", ""),
                    decimals: decimals.to_string().replace("\"", ""),
                    name: name.to_string().replace("\"", ""),
                    symbol: symbol.to_string().replace("\"", ""),
                    token_type: token_type.to_string().replace("\"", ""),
                    balance_in_usd: String::new(),
                };
                vec.push(token_info);
            }
            return HttpResponse::Ok().json(vec);
        }
        return HttpResponse::InternalServerError().json("Serialization error");
    } else {
        return HttpResponse::NotFound().into();
    }
}

#[post("/ethbalancel1")]
async fn get_eth_balance_on_l1(address: String) -> impl Responder {
    // Construct the complete URL
    let url = "https://explorerl1-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/api?module=account&action=eth_get_balance&address=".to_string() + &address;

    // Send an HTTP GET request
    if let Ok(response_result) = reqwest::get(&url).await {
        if let Ok(json_result) = response_result.json::<serde_json::Value>().await {
            let hex_balance = json_result["result"].to_string();
            if hex_balance == String::from("null") {
                return HttpResponse::Ok().json(EthBalance::default());
            }
            let hex_balance_trimmed = hex_balance.trim_matches('\\').trim_matches('\"');
            let hex_balance_trimmed = hex_balance_trimmed.trim_start_matches("0x");
            if let Ok(eth_balance) = BigUint::from_str_radix(hex_balance_trimmed, 16) {
                let eth_balance = EthBalance {
                    balance: eth_balance.to_string(),
                    balance_in_usd: String::new(),
                    network: String::from("l1-bob"),
                };
                return HttpResponse::Ok().json(eth_balance);
            } else {
                return HttpResponse::InternalServerError().json("Conversion Error");
            }
        }
        return HttpResponse::InternalServerError().json("Serialization error");
    } else {
        return HttpResponse::BadRequest().into();
    }
}

#[post("/ethbalancel2")]
async fn get_eth_balance_on_l2(address: String) -> impl Responder {
    // Construct the complete URL
    let url = "https://explorerl2-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/api?module=account&action=eth_get_balance&address=".to_string() + &address;

    // Send an HTTP GET request
    if let Ok(response_result) = reqwest::get(&url).await {
        if let Ok(json_result) = response_result.json::<serde_json::Value>().await {
            let hex_balance = json_result["result"].to_string();
            if hex_balance == String::from("null") {
                return HttpResponse::Ok().json(EthBalance::default());
            }
            let hex_balance_trimmed = hex_balance.trim_matches('\\').trim_matches('\"');
            let hex_balance_trimmed = hex_balance_trimmed.trim_start_matches("0x");
            if let Ok(eth_balance) = BigUint::from_str_radix(hex_balance_trimmed, 16) {
                let eth_balance = EthBalance {
                    balance: eth_balance.to_string(),
                    balance_in_usd: String::new(),
                    network: String::from("l2-bob"),
                };
                return HttpResponse::Ok().json(eth_balance);
            } else {
                return HttpResponse::InternalServerError().json("Conversion Error");
            }
        }
        return HttpResponse::InternalServerError().json("Serialization error");
    } else {
        return HttpResponse::BadRequest().into();
    }
}

#[post("/btcbalance")]
async fn btc_balance(address: String) -> impl Responder {
    let url = "https://explorerl2-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/api?module=account&action=eth_get_balance&address=".to_string() + &address;

    let btc_balance = BtcBalance {
        ticker: String::from("BTC"),
        balance: String::from("18000"),
        balance_in_usd: String::from("26000"),
        network: String::from("testnet"),
    };
    HttpResponse::Ok().json(btc_balance)
}

#[post("/brcbalance")]
async fn brc20_balance(address: String) -> impl Responder {
    let url = "https://explorerl2-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/api?module=account&action=eth_get_balance&address=".to_string() + &address;
    let mut vec = Vec::new();
    let balance = BtcBalance {
        ticker: String::from("ORDI"),
        balance: String::from("18000"),
        balance_in_usd: String::from("26000"),
        network: String::from("testnet"),
    };
    vec.push(balance.clone());
    vec.push(balance);
    HttpResponse::Ok().json(vec)
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(get_token_balance_on_l1)
        .service(get_eth_balance_on_l1)
        .service(get_token_balance_on_l2)
        .service(get_eth_balance_on_l2)
        .service(brc20_balance)
        .service(btc_balance);
    conf.service(scope);
}
