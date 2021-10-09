import React, {FunctionComponent, useEffect, useState} from 'react';
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
      // const provider = await detectEthereumProvider();
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
    if (!activeContract) {
      load();
    }
  }, []);

  const triggerCall = async (contract: Contract, functionName: string, args: any[]) => {
    const trueName = contract.interface.getFunction(functionName).name;
    const tx = await contract.populateTransaction[trueName](...args);
    const res = await providers.getDefaultProvider().call(tx);
    try {
      setCurrentCallRes(ethers.utils.toUtf8String(res));
    } catch (e) {
      setCurrentCallRes(res.toString());
    }
  }

  const FunctionDrawer: FunctionComponent<{functionName: string}> = ({functionName}) => {
    // stores input values
    const [args, setArgs] = useState<string[]>([]);

    // read function params, make inputs for each and assign values to args
    console.log("function name", functionName);
    const paramTypes = functionName.split(/(.+)/);
    console.log("param types", paramTypes);
    const functionSpec = activeContract && activeContract.interface.getFunction(functionName);
    const rawArgs = activeContract && activeContract.interface.fragments.find(fragment => functionName.startsWith(fragment.name))?.inputs;
    console.log("raw args", rawArgs);
    rawArgs?.forEach(arg => {
      args.push("");
    })
    console.log("args", args);
    return (activeContract && rawArgs ? <Card>
      <Card.Body>
        <p>{functionName}{functionSpec && functionSpec.payable && <em style={{color: 'green', padding: 6}}>Payable</em>}</p>
        {rawArgs.map((arg, idx) => {
          let id = `${functionName}.${arg.name}`;
          return (<div>
          <input id={id} type="text" placeholder={arg.name} onChange={(e) => {
            let thisArgs = args;
            thisArgs[idx] = e.target.value;
            setArgs(thisArgs);
          }} />
          </div>)
        })}
        <Button variant="link" onClick={() => triggerCall(activeContract, functionName, args)}>{functionName}</Button>
        </Card.Body>
      </Card> : <></>
    )
  }
  
  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={6}>
            {
              activeContract && Object.keys(activeContract.functions)
                .filter(key => key.endsWith(")"))
                .map((functionName, idx) => (
                  <div key={idx}>
                    <FunctionDrawer functionName={functionName} />
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
