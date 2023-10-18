import { CTA, Flex, Span } from '@interlay/ui';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import truncateEthAddress from 'truncate-eth-address';
import { useAccount } from 'wagmi';
import { StyledHeader } from './Layout.styles';

const Header = () => {
  const { open } = useWeb3Modal();
  const { address, isConnecting } = useAccount();

  return (
    <StyledHeader elementType='header' alignItems='center' justifyContent='space-between'>
        <CTA disabled={isConnecting} size='small' onPress={() => open()}>
          {address ? (
            <Flex elementType='span' gap='spacing2'>
              <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
              <Span style={{ color: 'inherit' }} size='s' color='tertiary'>
                {truncateEthAddress(address)}
              </Span>
            </Flex>
          ) : (
            'Connect Wallet'
          )}
        </CTA>
    </StyledHeader>
  );
};

export { Header };
