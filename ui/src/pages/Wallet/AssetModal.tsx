import { Modal, ModalBody, ModalHeader, ModalProps } from '@interlay/ui';
import { usePublicClient } from 'wagmi';
import { Balance } from '../../hooks/useBalances';
import { HexString } from '../../types';
import { useState } from 'react';

type Props = {
  type: 'send' | 'receive';
  ticker: string;
  balance: Balance;
  evmAccount?: HexString;
  bitcoinAddress?: string;
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
  ...props
}: AssetModalProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false);

  return (
    <Modal {...props} onClose={onClose}>
      <ModalHeader>Fill Order</ModalHeader>
      <ModalBody>
        {
          type === 'receive'
            ? `Send funds to address: ${
                balance.type === 'BRC20' || balance.type === 'BTC' ? bitcoinAddress : evmAccount
              }`
            : 'todo' // <SendAssetForm isLoading={isLoading} onSubmit={handleSendAsset}  />
        }
      </ModalBody>
    </Modal>
  );
};

export { AssetModal };
export type { AssetModalProps };
