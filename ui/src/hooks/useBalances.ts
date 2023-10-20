import { useQuery } from '@tanstack/react-query';

import Big from 'big.js';
import { useCallback, useMemo } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { CurrencyTicker, Erc20Currencies, Erc20CurrencyTicker, currencies } from '../constants';
import { REFETCH_INTERVAL } from '../constants/query';
import { ERC20Abi } from '../contracts/abi/ERC20.abi';
import { Amount } from '../utils/amount';
import { isBitcoinTicker } from '../utils/currencies';
import { useGetOrders } from './fetchers/useGetOrders';
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

const apiUrl = 'localhost:8000';

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

const useBalances = (evmAccount, publicClient) => {
  // TODO: add transfer event listener and update balance on transfer in/out
  const { data: erc20Balances, ...erc20QueryResult } = useQuery({
    queryKey: ['erc20-balances', evmAccount],
    enabled: !!evmAccount && !!publicClient,
    queryFn: () => getErc20Balances(publicClient, evmAccount),
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const { data: ethBalance, ...ethQueryResult } = useQuery({
    queryKey: ['eth-balances', evmAccount],
    enabled: !!evmAccount && !!publicClient,
    queryFn: async () => {
      if (!evmAccount) return;
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
      // todo: call api
    },
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  const balances = useMemo(() => ({ ...(erc20Balances || {}), ...(ethBalance || {}) }), [erc20Balances, ethBalance]);

  const refetchBalances = () => {
    //todo
  };
  // const getBalance = useCallback(
  //   (ticker: CurrencyTicker) => {
  //     const currency = currencies[ticker];

  //     if (isBitcoinTicker(ticker) || data?.[ticker] === undefined) {
  //       return new Amount(currency, 0);
  //     }

  //     const current = new Amount(currencies[ticker], Number(data[ticker]));

  //     const toDeduct = orders.owned.reduce(
  //       (acc, order) =>
  //         order.offeringCurrency.ticker === currency.ticker
  //           ? acc.add(new Amount(order.offeringCurrency, Number(order.availableLiquidity)).toBig())
  //           : acc,
  //       new Big(0)
  //     );

  //     const balance = current.toBig().minus(toDeduct);

  //     return balance.gt(0) ? new Amount(currency, balance, true) : new Amount(currency, 0);
  //   },
  //   [data, orders.owned]
  // );

  return { balances, refetchBalances };
};

export { useBalances };
export type { Balance, Balances };
