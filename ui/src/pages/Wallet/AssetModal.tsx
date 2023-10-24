import { Input, Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { Balance } from '../../hooks/useBalances';
import { HexString } from '../../types';
import { WalletClient } from 'viem';
import { SendAssetForm } from './SendAssetForm';

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
          <SendAssetForm walletClient={walletClient} ticker={ticker} balance={balance} onSubmit={handleSendAsset} />
        )}
      </ModalBody>
    </Modal>
  );
};

export { AssetModal };
export type { AssetModalProps };
