import { theme } from '@interlay/theme';
import { CTA, Card, Flex, Span, Table, TableProps, TokenStack } from '@interlay/ui';
import { ReactNode, useMemo, useState } from 'react';
import { formatUSD } from '../../utils/format';
import { Balance, Balances } from '../../hooks/useBalances';
import { AssetModal } from './AssetModal';
import { HexString } from '../../types';
import { toBaseAmountFromDecimals } from '../../utils/currencies';
import { WalletClient } from 'viem';

const AmountCell = ({ amount, valueUSD, ticker }: { amount: string; ticker: string; valueUSD?: number }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {!Number(amount)
        ? '—'
        : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(Number(amount))} ${ticker}`}
    </Span>
    {valueUSD && <Span size='s'>{formatUSD(valueUSD)}</Span>}
  </Flex>
);

const AssetCell = ({ name, tickers }: { name: string; tickers: string[] }) => (
  <Flex alignItems='center' gap='spacing2'>
    <TokenStack tickers={tickers} />
    <Span weight='bold' size='s'>
      {name}
    </Span>
  </Flex>
);

enum AssetsTableColumns {
  ASSET = 'asset',
  BALANCE = 'balance',
  ACTION = 'action'
}

type AssetsTableRow = {
  id: string;
  [AssetsTableColumns.ASSET]: ReactNode;
  [AssetsTableColumns.BALANCE]: ReactNode;
  [AssetsTableColumns.ACTION]: ReactNode;
};

type Props = {
  balances: Balances | undefined;
  evmAccount?: HexString;
  bitcoinAddress?: string;
  walletClient?: WalletClient;
  refetchBalances: () => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type AssetsTableProps = Props & InheritAttrs;

const AssetsTable = ({
  balances,
  refetchBalances,
  evmAccount,
  bitcoinAddress,
  walletClient,
  ...props
}: AssetsTableProps): JSX.Element => {
  const [assetModal, setAssetModal] = useState<{
    isOpen: boolean;
    type: 'send' | 'receive';
    ticker: string;
    balance?: Balance;
  }>({
    isOpen: false,
    type: 'send',
    ticker: 'BTC'
  });

  const handleOpenReceiveAssetModal = (ticker: string, balance: Balance) =>
    setAssetModal({ isOpen: true, type: 'receive', ticker, balance });

  const handleOpenSendAssetModal = (ticker: string, balance: Balance) =>
    setAssetModal({ isOpen: true, type: 'send', ticker, balance });

  const handleCloseModal = () => setAssetModal((s) => ({ ...s, isOpen: false }));

  const columns = [
    { name: 'Asset', id: AssetsTableColumns.ASSET },
    { name: 'Balance', id: AssetsTableColumns.BALANCE },
    { name: '', id: AssetsTableColumns.ACTION }
  ];

  const rows: AssetsTableRow[] = useMemo(
    () =>
      balances
        ? Object.entries(balances).map(([ticker, balance]) => {
            return {
              id: `${ticker}-${balance.type}`,
              asset: <AssetCell name={ticker} tickers={[ticker]} />,
              balance: (
                <AmountCell amount={toBaseAmountFromDecimals(balance.amount, balance.decimals)} ticker={ticker} />
              ),
              action: (
                <Flex justifyContent='flex-end' gap='spacing4' alignItems='center'>
                  <CTA onPress={() => handleOpenSendAssetModal(ticker, balance)} size='small'>
                    Send
                  </CTA>
                  <CTA onPress={() => handleOpenReceiveAssetModal(ticker, balance)} size='small'>
                    Receive
                  </CTA>
                </Flex>
              )
            };
          })
        : [],
    [balances]
  );

  return (
    <div style={{ margin: `${theme.spacing.spacing4} 0` }}>
      <Card>
        <Table {...props} columns={columns} rows={rows} />
      </Card>
      {assetModal.balance && (
        <AssetModal
          isOpen={assetModal.isOpen}
          type={assetModal.type}
          onClose={handleCloseModal}
          refetchBalances={refetchBalances}
          ticker={assetModal.ticker}
          balance={assetModal.balance}
          evmAccount={evmAccount}
          bitcoinAddress={bitcoinAddress}
          walletClient={walletClient}
        />
      )}
    </div>
  );
};

export { AssetsTable };
export type { AssetsTableProps };
