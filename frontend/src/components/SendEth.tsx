import React, { FunctionComponent, useState } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { utils } from "ethers";

// components
import Input from './Input';

// lib
import { WalletResponse } from '../lib/cache/wallets';
import { getProvider } from "../lib/provider";
import WalletDropdown from './WalletDropdown';

type SendEthProps = {
    queueTx: Function,
    wallets: WalletResponse[],
};

const SendEth: FunctionComponent<SendEthProps> = ({queueTx, wallets}) => {
    const [sendValue, setSendValue] = useState<string>();
    const [recipientAddress, setRecipientAddress] = useState<string>();
    const [chosenWallet, setChosenWallet] = useState<WalletResponse>();

    const addTxToQueue = () => {
        if (recipientAddress && sendValue && utils.isAddress(recipientAddress) && chosenWallet) {
            console.log("adding \"send eth\" tx to queue");
            const provider = getProvider();
            queueTx(recipientAddress, sendValue, provider, chosenWallet);
        } else {
            alert("Invalid \"Send Eth\" parameters.");
        }
    }

    return (<Card>
        <Card.Body>
            <Card.Title>Send Eth</Card.Title>
            <Input id="send_value" value={sendValue} setValue={setSendValue} inputProps={{type: "number", placeholder: "ETH Amount (wei)"}} />
            <Input id="recipient" value={recipientAddress} setValue={setRecipientAddress} inputProps={{placeholder: "Recipient Address"}} />
            <WalletDropdown wallets={wallets} setWallet={setChosenWallet} />
            <Button disabled={!sendValue || !recipientAddress || !chosenWallet} onClick={addTxToQueue} variant="link">Send Eth</Button>
        </Card.Body>
    </Card>)
}

export default SendEth;
