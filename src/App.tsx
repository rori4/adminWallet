import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Row,
} from "react-bootstrap";
import { Contract } from 'ethers';
// import detectEthereumProvider from '@metamask/detect-provider';

// components
import FunctionDrawer from './components/FunctionDrawer';
import Input from './components/Input';

// lib
import { getContracts, addContract as addContractToCache, flush } from "./lib/cache";
console.log(getContracts());

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  const [contractAddress, setContractAddress] = useState<string>();
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
      const contracts = getContracts();
      console.log("contracts", contracts);
      setContracts(contracts);
    }
    load();
  }, [activeContract]);

  const addContract = () => {
    if (contractAddress)
      addContractToCache(contractAddress);
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={6}>
            <h3>Contracts</h3>
            <Input label="Add Contract" value={contractAddress} setValue={setContractAddress} id="contractAddress" />
            <Button disabled={!contractAddress} size="sm" onClick={addContract}>Add Contract</Button>
            <hr />
            <Dropdown>
              <Dropdown.Toggle variant="link" id="contract-dropdown">{activeContract?.address || "Choose a contract"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {contracts?.map((contract, idx) => <Dropdown.Item key={idx} onClick={() => setActiveContract(contract)}>{contract.address}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
            {
              activeContract && <>
              <code>{activeContract.address}</code>
              {console.log(activeContract)}
              {Object.keys(activeContract.interface.functions)
                .filter(key => key.endsWith(")"))
                .map((functionName, idx) => (
                  <div key={idx}>
                    <FunctionDrawer functionName={functionName} contract={activeContract} />
                  </div>
              ))}
            </>}
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
