import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Accordion,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { BigNumber, Contract } from 'ethers';

// components
import Contracts from './components/Contracts';
import Navbar from './components/Navbar';
import Wallets from './components/Wallets';
import TxQueue, { QueuedTx } from './components/TxQueue';
import { getContractName } from './components/helpers';

// lib
import { ContractResponse, getContracts } from './lib/cache/contracts';
import { getWallets, WalletResponse } from './lib/cache/wallets';
import { getProvider } from './lib/provider';
import { buildUnsignedContractTransaction, getTrueFunctionName, EthProvider, buildUnsignedSendEthTransaction } from "./lib/ethereum";
import SendEth from './components/SendEth';

function App() {
  const [activeContract, setActiveContract] = useState<Contract>();
  
  const [contracts, setContracts] = useState<ContractResponse[]>();
  const [wallets, setWallets] = useState<WalletResponse[]>([]);
  const [txQueue, setTxQueue] = useState<QueuedTx[]>([]);
  const provider = getProvider();

  const getNonceDelta = (wallet: WalletResponse) => (
    txQueue.filter(tx => tx.wallet === wallet).length
  )

  const queueContractTx = async (contract: Contract, functionName: string, args: string[], provider: EthProvider, wallet: WalletResponse, value?: string) => {
    // build raw transaction and add it to queue
    const unsignedTx = await buildUnsignedContractTransaction({
      contract, 
      functionName, 
      args, 
      wallet: wallet.wallet.connect(provider), 
      nonceDelta: getNonceDelta(wallet),
      value: value ? BigNumber.from(value) : BigNumber.from(0),
    });
    const newQueue = [...txQueue];
    newQueue.push({
      wallet,
      functionName: getTrueFunctionName(contract, functionName),
      contractName: getContractName(contract.address, contracts || []),
      tx: unsignedTx,
      args,
    });
    setTxQueue(newQueue);
    console.log("updated txQueue", newQueue);
  }

  const queueSendEthTx = async (recipient: string, value: string, provider: EthProvider, wallet: WalletResponse) => {
    // build raw tx and add to queue
    const unsignedTx = await buildUnsignedSendEthTransaction({
      nonceDelta: getNonceDelta(wallet),
      recipient,
      value: value ? BigNumber.from(value) : BigNumber.from(0),
      wallet: wallet.wallet.connect(provider),
    });
    const newQueue = [...txQueue];
    if (unsignedTx) {
      newQueue.push({
        wallet,
        tx: unsignedTx,
        args: [],
        functionName: "sendEth"
      });
      setTxQueue(newQueue);
      console.log("updated txQueue", newQueue);
    } else {
      console.error("could not build unsigned tx for \"send eth\"");
    }
  }

  useEffect(() => {
    async function load() {
      // test with wETH
      // const contract = await getContract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
      // setActiveContract(contract);
      console.log("loading cached data");
      const provider = getProvider();
      provider._networkPromise.catch(e => {
        alert("adminWallet failed to connect to the provider. Please double-check the Provider URL in the system settings.");
      });

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
      <Navbar setActiveContract={setActiveContract} setContracts={setContracts} />
      <Container className="main-container" style={{paddingTop: 16}}>
        <Row>
			<Col sm={7}>
				<span><em>Add transactions to the queue.</em></span>
				<SendEth queueTx={queueSendEthTx} wallets={wallets} />
				<hr />
				<Contracts 
					contracts={contracts} 
					setContracts={setContracts} 
					activeContract={activeContract} 
					setActiveContract={setActiveContract} 
					provider={provider} 
					queueTx={queueContractTx} 
					wallets={wallets}
				/>
			</Col>
			<Col sm={5}>
				<span><em>Sign and send queued transactions.</em></span>
				<Accordion defaultActiveKey="1">
					<Accordion.Item eventKey="0">
						<Accordion.Header>Wallets</Accordion.Header>
						<Accordion.Body>
							<Wallets wallets={wallets} setWallets={setWallets} />
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Transaction Queue</Accordion.Header>
						<Accordion.Body>
							<TxQueue transactions={txQueue} setTransactions={setTxQueue} />
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
