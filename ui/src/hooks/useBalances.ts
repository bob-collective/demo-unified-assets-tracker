import { useQuery } from '@tanstack/react-query';

import { useMemo } from 'react';
import { Erc20Currencies, Erc20CurrencyTicker } from '../constants';
import { REFETCH_INTERVAL } from '../constants/query';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { PublicClient } from 'viem';
import { HexString } from '../types';

interface BalanceBase {
  amount: bigint;
  type: 'ERC20' | 'ETH' | 'BRC20' | 'BTC';
  decimals: number;
}

interface Erc20Balance extends BalanceBase {
  amount: bigint;
  decimals: number;
  type: 'ERC20';
}

interface EthBalance extends BalanceBase {
  amount: bigint;
  decimals: 18;
  type: 'ETH';
}

interface Brc20Balance extends BalanceBase {
  amount: bigint;
  decimals: number;
  type: 'BRC20';
}

interface BtcBalance extends BalanceBase {
  amount: bigint;
  decimals: 8;
  type: 'BTC';
}

type Balance = Erc20Balance | EthBalance | Brc20Balance | BtcBalance;

type Erc20Balances = {
  [ticker in Erc20CurrencyTicker]: Erc20Balance;
};

type Balances = {
  [ticker: string]: Balance;
};

const apiUrl = 'http://localhost:8000';

const fetchFromApi = async (path: string, body: string) => {
  const res = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body
  });
  return await res.json();
};

const getErc20Balances = async (publicClient: PublicClient, address?: HexString): Promise<Erc20Balances> => {
  const balancesMulticallResult = await publicClient.multicall({
    contracts: Object.values(Erc20Currencies).map(({ address: erc20Address }) => ({
      abi: ERC20Abi,
      address: erc20Address,
      functionName: 'balanceOf',
      args: [address]
    }))
  });

  return Object.keys(Erc20Currencies).reduce<Erc20Balances>((result, ticker, index) => {
    const { decimals } = Erc20Currencies[ticker as Erc20CurrencyTicker];
    return { ...result, [ticker]: { amount: balancesMulticallResult[index].result, type: 'ERC20', decimals } };
  }, {} as Erc20Balances);
};

const useBalances = (evmAccount?: HexString, bitcoinAddress?: string, publicClient?: PublicClient) => {
  // TODO: add transfer event listener and update balance on transfer in/out
  const { data: erc20Balances, ...erc20QueryResult } = useQuery({
    queryKey: ['erc20-balances', evmAccount],
    enabled: !!evmAccount && !!publicClient,
    queryFn: () => publicClient && getErc20Balances(publicClient, evmAccount),
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const { data: ethBalance, ...ethQueryResult } = useQuery({
    queryKey: ['eth-balances', evmAccount],
    enabled: !!evmAccount && !!publicClient,
    queryFn: async () => {
      if (!evmAccount || !publicClient) return;
      const ethBalance = await publicClient.getBalance({ address: evmAccount, blockTag: 'safe' });
      return {
        ETH: {
          amount: ethBalance,
          decimals: 18,
          type: 'ETH'
        } as const
      };
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const { data: brc20Balance, ...brc20QueryResult } = useQuery({
    queryKey: ['brc20-balances', evmAccount],
    enabled: !!evmAccount && !!publicClient,
    queryFn: async () => {
      if (!bitcoinAddress) return;
      const response = await fetchFromApi('/api/brcbalance', bitcoinAddress);
      const brc20BalancesObject = response.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result: any, balance: any) => ({
          ...result,
          [balance.ticker]: { amount: BigInt(balance.balance), type: 'BRC20', decimals: 18 }
        }),
        {}
      );

      return brc20BalancesObject;
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const { data: btcBalance, ...btcQueryResult } = useQuery({
    queryKey: ['btc-balance', evmAccount],
    enabled: !!evmAccount && !!publicClient,
    queryFn: async () => {
      const res = await fetch(`https://mempool.space/testnet/api/address/${bitcoinAddress}`);
      const resJson = await res.json();
      const chainBalance = resJson.chain_stats.funded_txo_sum - resJson.chain_stats.spent_txo_sum;
      const mempoolBalance = resJson.mempool_stats.funded_txo_sum - resJson.mempool_stats.spent_txo_sum;
      return {
        BTC: {
          amount: chainBalance + mempoolBalance,
          decimals: 8,
          type: 'BTC'
        } as const
      };
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const balances = useMemo(
    () => ({ ...(erc20Balances || {}), ...(ethBalance || {}), ...(btcBalance || {}), ...(brc20Balance || {}) }),
    [brc20Balance, btcBalance, erc20Balances, ethBalance]
  );

  const refetchBalances = () => {
    erc20QueryResult.refetch();
    ethQueryResult.refetch();
    btcQueryResult.refetch();
    brc20QueryResult.refetch();
  };

  return { balances, refetchBalances };
};

export { useBalances };
export type { Balance, Balances };
