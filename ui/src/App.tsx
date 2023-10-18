import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import { L2_CHAIN_CONFIG, L2_METADATA, L2_PROJECT_ID, config } from './connectors/wagmi-connectors';
import Wallet from './pages/Wallet/Wallet';
import './utils/yup.custom';

const wagmiConfig = defaultWagmiConfig({ chains: [L2_CHAIN_CONFIG], projectId: L2_PROJECT_ID, metadata: L2_METADATA });

createWeb3Modal({
  defaultChain: L2_CHAIN_CONFIG,
  wagmiConfig: wagmiConfig,
  projectId: L2_PROJECT_ID,
  chains: config.chains
});

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route element={<Wallet/>} path='/' />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
