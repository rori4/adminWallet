import React, { useState, FunctionComponent } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { providers, utils } from "ethers";

// lib
import { getWallets, WalletResponse } from "../lib/cache/wallets";
import { sendMempoolBundle } from '../lib/ethereum';
import { sendFlashbotsBundle } from '../lib/flashbots';
import WalletDropdown from './WalletDropdown';

export type QueuedTx = {
    wallet: WalletResponse,
    contractName?: string,
    functionName?: string,
    args: string[],
    tx: providers.TransactionRequest,
};

type TxQueueProps = {
    transactions: QueuedTx[],
    setTransactions: Function,
}

const TxQueue: FunctionComponent<TxQueueProps> = ({setTransactions, transactions}) => {
    const [sendToFlashbots, setSendToFlashbots] = useState(false);
    const [sponsorWallet, setSponsorWallet] = useState<WalletResponse>();
    const [flashbotsSimulationOnly, setFlashbotsSimulationOnly] = useState(true);

    const sendBundle = async () => {
        if (sendToFlashbots && sponsorWallet) {
            const res = await sendFlashbotsBundle(transactions, sponsorWallet.wallet, flashbotsSimulationOnly);
            console.log("flashbots bundle res", res);
        } else {
            const res = await sendMempoolBundle(transactions);
            console.log("mempool bundle res", res);
        }
    }
    
    const deleteBundle = () => {
        setTransactions([]);
    }

    return (<>
        <Row>
            <Col sm={6}>
                <Form.Check type="switch" id="flashbots-switch" label="Send to Flashbots" defaultChecked={sendToFlashbots} onChange={() => setSendToFlashbots(!sendToFlashbots)} />
                {sendToFlashbots &&
                    <Form.Check type="switch" id="flashbots-sim-switch" label="Simulation Only" defaultChecked={flashbotsSimulationOnly} onChange={() => setFlashbotsSimulationOnly(!flashbotsSimulationOnly)} />
                }
            </Col>
            <Col sm={6}>
                <div style={{float: "right"}}>
                    {transactions.length > 0 ? <Button variant="outline-danger" onClick={deleteBundle}>Empty Tx Queue</Button> : <p><em>No transactions queued...</em></p>}
                </div>
            </Col>
        </Row>
        
        {
            transactions.map((tx, idx) => (
                <Card key={idx}>
                    <Card.Body>
                    {tx.contractName && <><strong>
                        {tx.contractName}
                    </strong><br /></>}
                    <strong><em>
                        {tx.functionName}({tx.args.reduce((a, b) => a === "" ? b : a + ", " + b, "")})
                    </em></strong>
                    <br />
                    <em><strong>From:</strong> {tx.tx.from} ({tx.wallet.name})</em>
                    <br />
                    <em><strong>To:</strong> {tx.tx.to}</em>
                    {(tx.tx.value && tx.tx.value > 0) && <><br /> <em>
                        <strong>Value: </strong>{`${utils.formatEther(tx.tx.value)} ETH`}
                    </em></>}
                    </Card.Body>
                </Card>
            ))
        }
        {sendToFlashbots && <>
            {!flashbotsSimulationOnly && <span style={{color: "orangered"}}><em>WARNING: Sending real transactions to mainnet.</em></span>}
            <WalletDropdown setWallet={setSponsorWallet} wallets={getWallets()} label="Choose FB Rep Wallet" />
        </>}
            <Button onClick={sendBundle} disabled={!transactions || transactions.length === 0 || (sendToFlashbots && !sponsorWallet)} style={{marginTop: 13}}>Send Bundle</Button>
    </>);
}

export default TxQueue;
