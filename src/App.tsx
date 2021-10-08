import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Contract, Wallet, ethers, providers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

import { getContract } from './lib/contract';

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  const [provider, setProvider] = useState<providers.JsonRpcProvider>();
  const [currentCallRes, setCurrentCallRes] = useState<String>();

  useEffect(() => {
    async function load() {
      // get metamask provider
      const provider = await detectEthereumProvider();
      // if (provider){
      //   const ethersProvider = new providers.JsonRpcProvider(provider.)
      //   setProvider(provider);
      // }
      // test with wETH
      const contract = await getContract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
      console.log(contract);
      console.log("functions", Object.keys(contract.functions));
      setActiveContract(contract);
    }
    load();
  }, []);

  const triggerCall = async (contract: Contract, functionName: string) => {
    const trueName = contract.interface.getFunction(functionName).name;
    const tx = await contract.populateTransaction[trueName]();
    const res = await providers.getDefaultProvider().call(tx);
    try {
      setCurrentCallRes(ethers.utils.toUtf8String(res));
    } catch (e) {
      setCurrentCallRes(res.toString());
    }
  }
  
  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={6}>
            {
              activeContract && Object.keys(activeContract.functions).map((functionName, idx) => (
                <div key={idx}>
                  <Button variant="link" onClick={() => triggerCall(activeContract, functionName)}>{functionName}</Button>
                </div>
              ))
            }
          </Col>
          <Col sm={6}>
            <code>{currentCallRes}</code>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
