use crate::coingecko::get_value_in_usd;
use crate::response::{BtcBalance, EthBalance, TokenInfo};
use actix_web::{post, web, HttpResponse, Responder};
use num_bigint::BigUint;
use num_traits::Num;
use std::fs;

#[post("/tokenbalancel2")]
async fn get_token_balance_on_l2(address: String) -> impl Responder {
    // Construct the complete URL
    // Fixme: Hardcoded endpoint pass through cli
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

                let unit_price_in_usd =
                    get_value_in_usd(&symbol.to_string().replace("\"", "").to_lowercase()).await;

                let token_info: TokenInfo = TokenInfo {
                    balance: balance.to_string().replace("\"", ""),
                    contract_address: contract_address.to_string().replace("\"", ""),
                    decimals: decimals.to_string().replace("\"", ""),
                    name: name.to_string().replace("\"", ""),
                    symbol: symbol.to_string().replace("\"", ""),
                    token_type: token_type.to_string().replace("\"", ""),
                    unit_price_in_usd,
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
    // Fixme: Hardcoded endpoint pass through cli
    let url = "https://explorerl1-fluffy-bob-7mjgi9pmtg.t.conduit.xyz/api?module=account&action=tokenlist&address=".to_string() + &address;

    let mut vec = Vec::new();
    // Send an HTTP GET request
    // Fixme: Duplicated codeblock
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
                let unit_price_in_usd =
                    get_value_in_usd(&symbol.to_string().replace("\"", "").to_lowercase()).await;

                let token_info: TokenInfo = TokenInfo {
                    balance: balance.to_string().replace("\"", ""),
                    contract_address: contract_address.to_string().replace("\"", ""),
                    decimals: decimals.to_string().replace("\"", ""),
                    name: name.to_string().replace("\"", ""),
                    symbol: symbol.to_string().replace("\"", ""),
                    token_type: token_type.to_string().replace("\"", ""),
                    unit_price_in_usd,
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
                let unit_price_in_usd = get_value_in_usd("eth").await;

                let eth_balance = EthBalance {
                    balance: eth_balance.to_string(),
                    unit_price_in_usd,
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
                let unit_price_in_usd = get_value_in_usd("eth").await;

                let eth_balance = EthBalance {
                    balance: eth_balance.to_string(),
                    unit_price_in_usd,
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
    // Fixme change to testnet once it is available
    let url = "https://open-api.unisat.io/v1/indexer/address/".to_string() + &address + "/balance";
    let token = fs::read_to_string("unisat_api_key.txt").unwrap().lines().next().unwrap().to_string();

    if let Ok(response_result) = reqwest::Client::new()
        .get(&url)
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
    {
        let http_response = HttpResponse::new(response_result.status());
        if http_response.error().is_some() {
            return http_response;
        }

        if let Ok(json_result) = response_result.json::<serde_json::Value>().await {
            let balance = json_result["data"]["inscriptionSatoshi"].to_string();
            if balance == String::from("null") {
                return HttpResponse::Ok().json(BtcBalance::default());
            }
            let value_in_usd = get_value_in_usd("btc").await;
            let btc_balance = BtcBalance::new(balance, value_in_usd);

            return HttpResponse::Ok().json(btc_balance);
        }
        return HttpResponse::InternalServerError().json("Serialization error");
    }
    return HttpResponse::BadRequest().into();
}

async fn brc20_tokens_supported_by_indexer() -> Vec<String> {
    // Fixme change to testnet once it is available
    let url = "https://open-api.unisat.io/v1/indexer/brc20/list".to_string();
    let token = fs::read_to_string("unisat_api_key.txt").unwrap().lines().next().unwrap().to_string();
    let mut brc20 = Vec::new();

    if let Ok(response_result) = reqwest::Client::new()
        .get(&url)
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
    {
        if let Ok(json_result) = response_result.json::<serde_json::Value>().await {
            for item in json_result["data"]["detail"].as_array().unwrap_or(&vec![]) {
                brc20.push(item.to_string().replace("\"", ""));
            }
        }
    }
    brc20
}

#[post("/brcbalance")]
async fn brc20_balance(address: String) -> impl Responder {
    let token = fs::read_to_string("unisat_api_key.txt").unwrap().lines().next().unwrap().to_string();
    let tokens = brc20_tokens_supported_by_indexer().await;
    let client = reqwest::Client::new();

    let mut responses = Vec::new();
    for ticker in &tokens {
        // Fixme change to testnet once it is available
        let url = "https://open-api.unisat.io/v1/indexer/address/".to_string()
            + &address
            + "/brc20/"
            + &ticker
            + "/info";
        if let Ok(response_result) = client
            .get(&url)
            .header("Authorization", format!("Bearer {}", token))
            .send()
            .await
        {
            let http_response = HttpResponse::new(response_result.status());
            if http_response.error().is_some() {
                return http_response;
            }

            if let Ok(json_result) = response_result.json::<serde_json::Value>().await {
                let balance = json_result["data"]["availableBalance"]
                    .to_string()
                    .replace("\"", "");
                let ticker = json_result["data"]["ticker"].to_string().replace("\"", "");

                let unit_price_in_usd = get_value_in_usd(&ticker.to_lowercase()).await;

                if balance == String::from("null") {
                    println!(" -- Skipping As no balance --");
                } else {
                    let brc20 = BtcBalance::for_brc20(ticker, balance, unit_price_in_usd);
                    responses.push(brc20);
                }
            } else {
                return HttpResponse::InternalServerError().json("Serialization error");
            }
        } else {
            return HttpResponse::BadRequest().into();
        }
    }
    return HttpResponse::Ok().json(responses);
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
