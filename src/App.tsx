import React, { FunctionComponent, useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Contract } from 'ethers';
// import detectEthereumProvider from '@metamask/detect-provider';

// components
import FunctionDrawer from './components/FunctionDrawer';

// lib
import { getContract } from './lib/contract';

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  // const [provider, setProvider] = useState<providers.JsonRpcProvider>();

  useEffect(() => {
    async function load() {
      // get metamask provider
      // const provider = await detectEthereumProvider();
      // if (provider){
      //   const ethersProvider = new providers.JsonRpcProvider(provider.)
      //   setProvider(provider);
      // }

      // test with wETH
      const contract = await getContract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
      setActiveContract(contract);
    }
    if (!activeContract) {
      load();
    }
  }, [activeContract]);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={6}>
            <h3>Contract</h3>
            {
              activeContract && Object.keys(activeContract.functions)
                .filter(key => key.endsWith(")"))
                .map((functionName, idx) => (
                  <div key={idx}>
                    <FunctionDrawer functionName={functionName} contract={activeContract} />
                  </div>
                ))
            }
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
