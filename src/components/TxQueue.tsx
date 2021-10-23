import React, {FunctionComponent} from 'react'
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

// lib
import { WalletResponse } from "../lib/cache/wallets";
import { sendMempoolBundle } from '../lib/ethereum';

export type QueuedTx = {
    wallet: WalletResponse,
    contractName: string,
    functionName: string,
    args: string[],
    signedTx: string,
};

type TxQueueProps = {
    transactions: QueuedTx[],
}

const TxQueue: FunctionComponent<TxQueueProps> = ({transactions}) => {
    const sendBundle = () => {
        sendMempoolBundle(transactions.map(queuedTx => queuedTx.signedTx));
    }
    return (<Card>
        <Card.Body>
            <h3>Transactions</h3>
            {
                transactions.map((tx, idx) => (
                    <Card key={idx}>
                        <Card.Body>
                        <strong>
                            {tx.contractName}
                        </strong>
                        <br />
                        <em>
                            {tx.functionName}({tx.args.reduce((a, b) => a === "" ? b : a + ", " + b, "")})
                        </em>
                        <br />
                        Signer: {tx.wallet.name}
                        </Card.Body>
                    </Card>
                ))
            }
            <Button onClick={sendBundle} disabled={!transactions || transactions.length === 0}>Send Bundle</Button>
        </Card.Body>
    </Card>);
}

export default TxQueue;
