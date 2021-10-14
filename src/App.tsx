import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Contract } from 'ethers';

// components
import AdminControls from './components/AdminControls';
import Contracts from './components/Contracts';
import Wallets from './components/Wallets';

// lib
import { ContractResponse, getContracts } from './lib/cache/contracts';
import { getWallets, WalletResponse } from './lib/cache/wallets';
import { getProvider } from './lib/provider';

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  
  const [contracts, setContracts] = useState<ContractResponse[]>();
  const [wallets, setWallets] = useState<WalletResponse[]>();
  const provider = getProvider();

  useEffect(() => {
    async function load() {
      // test with wETH
      // const contract = await getContract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
      // setActiveContract(contract);

      // load contracts from cache
      if (!contracts) {
        const contracts = await getContracts();
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
            <Contracts contracts={contracts} setContracts={setContracts} activeContract={activeContract} setActiveContract={setActiveContract} provider={provider} />
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
