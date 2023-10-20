import { AssetsTable } from './AssetsTable'
import { Header } from '../../components/Layout/Header';
import { useConnect } from '../../hooks/useConnect';
import { useBalances } from '../../hooks/useBalances';

type Props = {}

const Wallet = (props: Props) => {
  const { connect, evmAccount, bitcoinAddress, publicClient } = useConnect();
  const {balances, refetchBalances} = useBalances(evmAccount, publicClient);
  return (
    <div>
      <Header {...{connect, evmAccount, bitcoinAddress}} />
      <AssetsTable {...{balances, refetchBalances, evmAccount, bitcoinAddress}} />
      </div>
  )
}

export default Wallet