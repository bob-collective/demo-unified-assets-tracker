import { AssetsTable } from './AssetsTable';
import { Header } from '../../components/Layout/Header';
import { useConnect } from '../../hooks/useConnect';
import { useBalances } from '../../hooks/useBalances';

const Wallet = () => {
  const { connect, evmAccount, bitcoinAddress, publicClient, walletClient } = useConnect();
  const { balances, refetchBalances } = useBalances(evmAccount, bitcoinAddress, publicClient);
  return (
    <div>
      <Header {...{ connect, evmAccount, bitcoinAddress }} />
      <AssetsTable {...{ balances, refetchBalances, evmAccount, bitcoinAddress, walletClient }} />
    </div>
  );
};

export default Wallet;
