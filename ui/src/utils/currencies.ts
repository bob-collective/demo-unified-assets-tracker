import Big from 'big.js';

export const toAtomicAmountFromDecimals = (amount: string, decimals: number) => {
  return BigInt(new Big(amount).mul(new Big(10).pow(decimals)).toString());
};

export const toBaseAmountFromDecimals = (amount: bigint, decimals: number): string => {
  return (Number(amount) / 10 ** decimals).toString();
};
