import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { BigNumber, Contract } from 'ethers';

// components
import AdminControls from './components/AdminControls';
import Contracts from './components/Contracts';
import Wallets from './components/Wallets';
import TxQueue, { QueuedTx } from './components/TxQueue';
import { getContractName } from './components/helpers';

// lib
import { ContractResponse, getContracts } from './lib/cache/contracts';
import { getWallets, WalletResponse } from './lib/cache/wallets';
import { getProvider } from './lib/provider';
import { buildSignedTransaction, getTrueName, EthProvider } from "./lib/ethereum";

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  
  const [contracts, setContracts] = useState<ContractResponse[]>();
  const [wallets, setWallets] = useState<WalletResponse[]>([]);
  const [txQueue, setTxQueue] = useState<QueuedTx[]>([]);
  const provider = getProvider();

  const queueTx = async (contract: Contract, functionName: string, args: string[], provider: EthProvider, wallet: WalletResponse, value?: string) => {
    // build raw transaction and add it to queue
    const signedTx = await buildSignedTransaction({
      contract, 
      functionName, 
      args, 
      wallet: wallet.wallet.connect(provider), 
      nonceDelta: txQueue.length,
      value: value ? BigNumber.from(value) : BigNumber.from(0),
    });
    const newQueue = [...txQueue];
    newQueue.push({
      wallet,
      functionName: getTrueName(contract, functionName),
      contractName: getContractName(contract.address, contracts || []),
      signedTx,
      args,
    });
    setTxQueue(newQueue);
    console.log(newQueue);
  }

  useEffect(() => {
    async function load() {
      // test with wETH
      // const contract = await getContract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
      // setActiveContract(contract);
      console.log("loading cached data");

      // load contracts from cache
      const contracts = await getContracts();
      setContracts(contracts);
      
      // load wallets from cache
      const wallets = getWallets();
      setWallets(wallets);
    }
    load();
  }, []);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={7}>
            <Contracts 
              contracts={contracts} 
              setContracts={setContracts} 
              activeContract={activeContract} 
              setActiveContract={setActiveContract} 
              provider={provider} 
              queueTx={queueTx} 
              wallets={wallets}
            />
          </Col>
          <Col sm={5}>
            <Wallets wallets={wallets} setWallets={setWallets} />
            <hr />
            <AdminControls setContracts={setContracts} setActiveContract={setActiveContract} />
            <hr />
            <TxQueue transactions={txQueue} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
