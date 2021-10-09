import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Row,
} from "react-bootstrap";
import { Contract } from 'ethers';
// import detectEthereumProvider from '@metamask/detect-provider';

// components
import Contracts from './components/Contracts';

// lib
import { getContracts, addContract as addContractToCache, flush } from "./lib/cache";
console.log(getContracts());

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  
  const [contracts, setContracts] = useState<Contract[]>();
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

      // flush cache for testing
      // flush();

      // test with wETH
      // const contract = await getContract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
      // setActiveContract(contract);

      // load contracts from cache
      if (!contracts) {
        const contracts = getContracts();
        console.log("contracts", contracts);
        setContracts(contracts);
      }
    }
    load();
  }, [activeContract, contracts]);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={4}>
            <Card itemType="borderless">
              <Card.Body>
                <Card.Title>Admin Controls</Card.Title>
                <Button onClick={() => {flush(); setContracts(undefined); setActiveContract(undefined);}}>Flush Cache</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={6}>
            <Contracts contracts={contracts} setContracts={setContracts} activeContract={activeContract} setActiveContract={setActiveContract} />
          </Col>
          <Col sm={6}>
            <h3>Signers</h3>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
