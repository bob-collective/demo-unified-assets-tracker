use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;

#[derive(Serialize, Deserialize)]
struct Coin {
    pub id: String,
    pub symbol: String,
    pub name: String,
}

fn read_json_file(file_path: &str) -> String {
    let mut file = File::open(file_path).expect("Failed to open file");
    let mut json_data = String::new();
    file.read_to_string(&mut json_data)
        .expect("Failed to read file");
    json_data
}

fn find_id_by_symbol(json_data: &str, symbol_to_find: &str) -> Option<Coin> {
    let coins: Vec<Coin> = serde_json::from_str(json_data).unwrap();
    let coin_map: HashMap<String, String> = coins
        .into_iter()
        .map(|coin| (coin.symbol, coin.id))
        .collect();

    let name = coin_map.get(symbol_to_find).map(|name| name.to_string());
    let id = coin_map.get(symbol_to_find).map(|id| id.to_string());
    match (id, name) {
        (Some(id), Some(name)) => Some(Coin {
            id,
            symbol: symbol_to_find.to_string(),
            name,
        }),
        _ => None,
    }
}

pub async fn get_value_in_usd(symbol_to_find: &str) -> String {
    let json_data = read_json_file("src/coins.json");

    if let Some(coin) = find_id_by_symbol(&json_data, symbol_to_find) {
        let url = "https://api.coingecko.com/api/v3/simple/price?ids=".to_string()
            + &coin.name
            + "&vs_currencies=usd";
        let response = reqwest::get(url).await.unwrap();
        if let Ok(json_result) = response.json::<serde_json::Value>().await {
            let result = json_result[coin.name]["usd"].to_string();
            if result == String::from("null") {
                return String::new();
            }
            return result;
        }
    }

    String::new()
}
