import { Flex } from '@interlay/ui';
import { HTMLAttributes } from 'react';
import { StyledMain } from './Layout.styles';

const Layout = (props: HTMLAttributes<unknown>) => (
  <Flex direction='column'>
    <StyledMain direction='column' {...props} />
  </Flex>
);

export { Layout };
