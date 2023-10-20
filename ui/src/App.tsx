import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import Wallet from './pages/Wallet/Wallet';
import './utils/yup.custom';


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
