import { CTA, Flex, Span } from '@interlay/ui';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import truncateEthAddress from 'truncate-eth-address';

import { StyledHeader } from './Layout.styles';

const Header = ({evmAccount, connect, bitcoinAddress}) => {


  return (
    <StyledHeader elementType='header' alignItems='center' justifyContent='space-between'>
        <CTA size='small' onPress={() => connect()}>
          {evmAccount ? (
            <Flex elementType='span' gap='spacing2'>
              <Jazzicon diameter={20} seed={jsNumberForAddress(evmAccount)} />
              <Span style={{ color: 'inherit' }} size='s' color='tertiary'>
                {truncateEthAddress(evmAccount)} | bitcoin: {bitcoinAddress}
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
