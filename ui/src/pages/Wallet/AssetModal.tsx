import { CTA, Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { Balance, } from '../../hooks/useBalances';
import { HexString } from '../../types';
import { useState } from 'react';

type Props = {
  type: 'send' | 'receive';
  ticker: string;
  balance: Balance;
  evmAccount?: HexString;
  bitcoinAddress?: string;
  walletClient?: WalletClient;
  refetchBalances: () => void;
};

type InheritAttrs = Omit<ModalProps, 'children'>;

type AssetModalProps = Props & InheritAttrs;

import { useForm } from '@interlay/hooks';
import { Card, Flex, Input, P, TokenInput } from '@interlay/ui';
import Big from 'big.js';
import { Erc20CurrencyTicker, Erc20Currencies } from '../../constants';
import { toAtomicAmountFromDecimals, toBaseAmountFromDecimals } from '../../utils/currencies';
import { formatUSD } from '../../utils/format';
import { AddOrderSchemaParams, addOrderSchema } from '../../utils/schemas';
import { WalletClient } from 'viem';
import { ERC20Abi } from '../../contracts/abi/ERC20.abi';

type AddOrderFormData = {
  amount?: string;
  receivingAddress?: string;
};

type AddOrderFormProps = {
  balance: Balance;
  ticker: string;
  walletClient?: WalletClient;
  evmAccount?: HexString;
  isLoading: boolean;
  onSubmit: (data: Required<AddOrderFormData>) => void;
};

const SendAssetForm = ({ balance, ticker, walletClient, evmAccount, onSubmit }: AddOrderFormProps): JSX.Element => {
  const handleSubmit = async (values: AddOrderFormData) => {
    console.log(values, evmAccount, walletClient);
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

    onSubmit?.(values as Required<AddOrderFormData>);
  };

  const inputBalance = toBaseAmountFromDecimals(balance.amount, balance.decimals);

  const schemaParams: AddOrderSchemaParams = {
    inputValue: {
      maxAmount: Big(inputBalance)
    }
  };

  const form = useForm<AddOrderFormData>({
    initialValues: {
      amount: '',
      receivingAddress: ''
    },
    validationSchema: addOrderSchema(schemaParams),
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
            <P size='xs'>Tx Fees 0 BOB ({formatUSD(0)})</P>
          </Card>
        </Flex>
      </Flex>
      <CTA size='large' type='submit'>
        Send {ticker}
      </CTA>
    </form>
  );
};

const AssetModal = ({
  type,
  ticker,
  balance,
  refetchBalances,
  evmAccount,
  bitcoinAddress,
  onClose,
  walletClient,
  ...props
}: AssetModalProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false);

  const handleSendAsset = () => {
    refetchBalances();
    onClose();
  };
  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Receive {ticker}</ModalHeader>
      <ModalBody>
        {type === 'receive' ? (
          <>
              <Input
                isDisabled
                label='Receiving Address'
                placeholder='Enter address of receiver'
                value={balance.type === 'BRC20' || balance.type === 'BTC' ? bitcoinAddress : evmAccount}
              />
          </>
        ) : (
          <SendAssetForm
            walletClient={walletClient}
            ticker={ticker}
            balance={balance}
            isLoading={isLoading}
            onSubmit={handleSendAsset}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export { AssetModal };
export type { AssetModalProps };
