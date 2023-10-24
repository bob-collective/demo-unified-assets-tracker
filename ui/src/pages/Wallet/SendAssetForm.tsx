import { useForm } from '@interlay/hooks';
import { Card, CTA, Flex, Input, P, TokenInput } from '@interlay/ui';
import { Erc20CurrencyTicker, Erc20Currencies } from '../../constants';
import { toAtomicAmountFromDecimals, toBaseAmountFromDecimals } from '../../utils/currencies';
import { formatUSD } from '../../utils/format';
import { WalletClient } from 'viem';
import { ERC20Abi } from '../../contracts/abi/ERC20.abi';
import { Balance } from '../../hooks/useBalances';
import { HexString } from '../../types';

type SendAssetFormData = {
  amount?: string;
  receivingAddress?: string;
};

type SendAssetFormProps = {
  balance: Balance;
  ticker: string;
  walletClient?: WalletClient;
  evmAccount?: HexString;
  onSubmit: (data: Required<SendAssetFormData>) => void;
};

const SendAssetForm = ({ balance, ticker, walletClient, evmAccount, onSubmit }: SendAssetFormProps): JSX.Element => {
  const handleSubmit = async (values: SendAssetFormData) => {
    if (
      values?.amount === undefined ||
      values?.receivingAddress === undefined ||
      evmAccount === undefined ||
      walletClient === undefined
    )
      return;
    const atomicAmount = toAtomicAmountFromDecimals(values.amount, balance.decimals);

    switch (balance.type) {
      case 'BRC20':
        // TODO: implement brc20 transfers
        break;
      case 'BTC':
        // TODO: implement sending of btc
        break;
      case 'ERC20': {
        const { address } = Erc20Currencies[ticker as Erc20CurrencyTicker];
        await walletClient.writeContract({
          address,
          abi: ERC20Abi,
          functionName: 'transfer',
          args: [values.receivingAddress as HexString, atomicAmount],
          account: evmAccount,
          chain: undefined
        });
        break;
      }
      case 'ETH': {
        await walletClient.sendTransaction({
          to: values.receivingAddress as HexString,
          value: atomicAmount,
          chain: undefined,
          account: evmAccount
        });
      }
    }

    onSubmit?.(values as Required<SendAssetFormData>);
  };

  const inputBalance = toBaseAmountFromDecimals(balance.amount, balance.decimals);

  const form = useForm<SendAssetFormData>({
    initialValues: {
      amount: '',
      receivingAddress: ''
    },
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <P size='s'>Input the details and values of your order's assets</P>
        <TokenInput
          ticker={ticker}
          label='Amount'
          balance={inputBalance}
          valueUSD={0}
          {...form.getTokenFieldProps('amount')}
        />
        <Input
          label='Receiving Address'
          placeholder='Enter address of receiver'
          {...form.getFieldProps('receivingAddress')}
        />
        <Flex direction='column' gap='spacing2'>
          <Card rounded='lg' variant='bordered' shadowed={false} padding='spacing3' background='tertiary'>
            <P size='xs'>Tx Fees 0 ETH ({formatUSD(0)})</P>
          </Card>
        </Flex>
      </Flex>
      <CTA size='large' type='submit'>
        Send {ticker}
      </CTA>
    </form>
  );
};

export { SendAssetForm };
