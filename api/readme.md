## Command Run Server on local host
- The server runns on `localhost:8000`
```shell
cd api
cargo run
```

# Apis 

### API Endpoint: `/api/ethbalancel2`

**HTTP Method:** `POST`

**Request Example:**

```shell
curl --location --request POST 'http://localhost:8000/api/ethbalancel2' \
--header 'Content-Type: text/plain' \
--data-raw '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
```

```json
{
    "balance": "904625697166532776746648320380374280103671755200316906557737278119145646739",
    "balance_in_usd": "",
    "network": "l2-bob"
}
```


### API Endpoint: `/api/ethbalancel1`

**HTTP Method:** `POST`

**Request Example:**

```shell
curl --location --request POST 'http://localhost:8000/api/ethbalancel1' \
--header 'Content-Type: text/plain' \
--data-raw '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
```

```json
{
    "balance": "904625697166532776746648320380374280103671755200316906557737278119145646739",
    "balance_in_usd": "",
    "network": "l1-bob"
}
```

### API Endpoint: `/api/tokenbalancel1`

**HTTP Method:** `POST`

**Request Example:**

```shell
curl --location --request POST 'http://localhost:8000/api/tokenbalancel1' \
--header 'Content-Type: text/plain' \
--data-raw '0xd8a0bb324b46D89C105BA98C402dF0972b9164Af'
```

```json
[
    {
        "balance": 2999900000000,
        "contract_address": "0x4f01078121e90915f9f1448de4b3c2515b5e2f3b",
        "decimals": 8,
        "name": "ZBTC",
        "symbol": "ZBTC",
        "token_type": "ERC-20",
        "balance_in_usd": ""
    }
]
```

### API Endpoint: `/api/tokenbalancel2`

**HTTP Method:** `POST`

**Request Example:**

```shell
curl --location --request POST 'http://localhost:8000/api/tokenbalancel2' \
--header 'Content-Type: text/plain' \
--data-raw '0xd8a0bb324b46D89C105BA98C402dF0972b9164Af'
```

```json
[
    {
        "balance": 2999900000000,
        "contract_address": "0x4f01078121e90915f9f1448de4b3c2515b5e2f3b",
        "decimals": 8,
        "name": "ZBTC",
        "symbol": "ZBTC",
        "token_type": "ERC-20",
        "balance_in_usd": ""
    }
]
```
