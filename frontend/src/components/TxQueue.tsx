import React, { useState, FunctionComponent } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
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
    const sendBundle = async () => {
        if (sendToFlashbots && sponsorWallet) {
            const res = await sendFlashbotsBundle(transactions, sponsorWallet.wallet);
            console.log("flashbots bundle res", res);
        } else {
            const res = await sendMempoolBundle(transactions);
            console.log("mempool bundle res", res);
        }
    }
    const deleteBundle = () => {
        setTransactions([]);
    }
    return (<Card>
        <Card.Body className={sendToFlashbots ? "flashbots-outline" : ""}>
            <h3>Transactions</h3>
            <Form.Check type="switch" id="flashbots-switch" label="Send to Flashbots" defaultChecked={sendToFlashbots} onChange={() => setSendToFlashbots(!sendToFlashbots)} />
            {transactions.length > 0 && <Button variant="outline-danger" onClick={deleteBundle}>Empty Tx Queue</Button>}
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
                        {(tx.tx.value && tx.tx.value > 0) && <><br /> <em>
                            <strong>Value: </strong>{`${utils.formatEther(tx.tx.value)} ETH`}
                        </em></>}
                        <br />
                        <em><strong>To:</strong> {tx.tx.to}</em>
                        <br />
                        <em><strong>From:</strong> {tx.tx.from} ({tx.wallet.name})</em>
                        </Card.Body>
                    </Card>
                ))
            }
            {sendToFlashbots && <WalletDropdown setWallet={setSponsorWallet} wallets={getWallets()} label="Choose FB Rep Wallet" />}
            <Button onClick={sendBundle} disabled={!transactions || transactions.length === 0 || (sendToFlashbots && !sponsorWallet)}>Send Bundle</Button>
        </Card.Body>
    </Card>);
}

export default TxQueue;
