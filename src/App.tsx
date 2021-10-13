import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Contract } from 'ethers';
// import detectEthereumProvider from '@metamask/detect-provider';

// components
import AdminControls from './components/AdminControls';
import Contracts from './components/Contracts';
import Wallets from './components/Wallets';

// lib
import { getContracts, getWallets, WalletResponse } from "./lib/cache";

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  
  const [contracts, setContracts] = useState<Contract[]>();
  const [wallets, setWallets] = useState<WalletResponse[]>();
  // const [provider, setProvider] = useState<providers.JsonRpcProvider>();

  useEffect(() => {
    async function load() {
      // get metamask provider
      // https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
      // const provider = await detectEthereumProvider();
      // if (provider){
      //   const ethersProvider = new providers.JsonRpcProvider(provider.)
      //   setProvider(provider);
      // }

      // test with wETH
      // const contract = await getContract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
      // setActiveContract(contract);

      // load contracts from cache
      if (!contracts) {
        const contracts = getContracts();
        console.log("contracts", contracts);
        setContracts(contracts);
      }
      if (!wallets) {
        const wallets = getWallets();
        console.log("wallets", wallets);
        setWallets(wallets);
      }
    }
    load();
  }, [activeContract, contracts, wallets]);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={7}>
            <Contracts contracts={contracts} setContracts={setContracts} activeContract={activeContract} setActiveContract={setActiveContract} />
          </Col>
          <Col sm={5}>
            <Wallets wallets={wallets} setWallets={setWallets} />
            <hr />
            <AdminControls setContracts={setContracts} setActiveContract={setActiveContract} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
