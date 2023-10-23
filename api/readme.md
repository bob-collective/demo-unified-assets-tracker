## Command To Run Server on local host
- The server runs on `localhost:8000`
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
  "balance": "7928779270223804700",
  "unit_price_in_usd": "1695.17",
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
  "balance": "7928779270223804700",
  "unit_price_in_usd": "1695.17",
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
        "balance": "999999999999998759206281000000",
        "contract_address": "0x3c252953224948e441aafde7b391685201ccd3bc",
        "decimals": "6",
        "name": "Tether USD",
        "symbol": "USDT",
        "token_type": "ERC-20",
        "unit_price_in_usd": "0.999829"
    },
    {
        "balance": "475007664984622633014",
        "contract_address": "0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b",
        "decimals": "18",
        "name": "bob btc",
        "symbol": "bBTC",
        "token_type": "ERC-20",
        "unit_price_in_usd": "30968"
    },
    {
        "balance": "999999500000000000000",
        "contract_address": "0xfecc3f37038999ede8e58a3c9e5b0e9a16e7d5bc",
        "decimals": "18",
        "name": "USDC",
        "symbol": "USDC",
        "token_type": "ERC-20",
        "unit_price_in_usd": "0.998046"
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
    "balance": "999999999999998759206281000000",
    "contract_address": "0x3c252953224948e441aafde7b391685201ccd3bc",
    "decimals": "6",
    "name": "Tether USD",
    "symbol": "USDT",
    "token_type": "ERC-20",
    "unit_price_in_usd": "0.999829"
  },
  {
    "balance": "475007664984622633014",
    "contract_address": "0xd6cd079ee8bc26b5000a5e1ea8d434c840e3434b",
    "decimals": "18",
    "name": "bob btc",
    "symbol": "bBTC",
    "token_type": "ERC-20",
    "unit_price_in_usd": "30968"
  },
  {
    "balance": "999999500000000000000",
    "contract_address": "0xfecc3f37038999ede8e58a3c9e5b0e9a16e7d5bc",
    "decimals": "18",
    "name": "USDC",
    "symbol": "USDC",
    "token_type": "ERC-20",
    "unit_price_in_usd": "0.998046"
  }
]
```

### API Endpoint: `/api/btcbalance`

**HTTP Method:** `POST`

**Request Example:**

```shell
curl --location --request POST 'http://localhost:8000/api/btcbalance' \
--header 'Content-Type: text/plain' \
--data-raw 'bc1pxaneaf3w4d27hl2y93fuft2xk6m4u3wc4rafevc6slgd7f5tq2dqyfgy06'
```

```json
{
  "ticker": "btc",
  "balance": "15834",
  "unit_price_in_usd": "30801",
  "network": "mainnet",
  "decimals": "8"
}
```

### API Endpoint: `/api/brcbalance`

**HTTP Method:** `POST`

**Request Example:**

```shell
curl --location --request POST 'http://localhost:8000/api/brcbalance' \
--header 'Content-Type: text/plain' \
--data-raw 'bc1pxaneaf3w4d27hl2y93fuft2xk6m4u3wc4rafevc6slgd7f5tq2dqyfgy06'
```


```json
[
  {
    "ticker": "ordi",
    "balance": "644000",
    "unit_price_in_usd": "4.2",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "meme",
    "balance": "0",
    "unit_price_in_usd": "0.00074936",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "punk",
    "balance": "0",
    "unit_price_in_usd": "",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "pepe",
    "balance": "0",
    "unit_price_in_usd": "0.00009124",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "bruh",
    "balance": "0",
    "unit_price_in_usd": "9.23266e-10",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "gold",
    "balance": "0",
    "unit_price_in_usd": "47.98",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "bayc",
    "balance": "0",
    "unit_price_in_usd": "",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "<10k",
    "balance": "0",
    "unit_price_in_usd": "",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "sats",
    "balance": "0",
    "unit_price_in_usd": "2.1624e-8",
    "network": "mainnet",
    "decimals": "0"
  },
  {
    "ticker": "sato",
    "balance": "0",
    "unit_price_in_usd": "",
    "network": "mainnet",
    "decimals": "0"
  }
]
```
