import React, { FunctionComponent, useState } from 'react';
import Button from "react-bootstrap/Button";
import { utils } from "ethers";

// components
import Input from './Input';

// lib
import { WalletResponse } from '../lib/cache/wallets';
import { getProvider } from "../lib/provider";
import WalletDropdown from './WalletDropdown';
import Toast from './Toast';
import EthValueInput from './EthValueInput';

type SendEthProps = {
    queueTx: Function,
    wallets: WalletResponse[],
};

const SendEth: FunctionComponent<SendEthProps> = ({queueTx, wallets}) => {
    const [sendValue, setSendValue] = useState<string>();
    const [recipientAddress, setRecipientAddress] = useState<string>();
    const [chosenWallet, setChosenWallet] = useState<WalletResponse>();
    const [showToast, setShowToast] = useState(false);

    const addTxToQueue = () => {
        if (recipientAddress && sendValue && utils.isAddress(recipientAddress) && chosenWallet) {
            console.log("adding \"send eth\" tx to queue");
            const provider = getProvider();
            queueTx(recipientAddress, sendValue, provider, chosenWallet);
            setShowToast(true);
        } else {
            alert("Invalid \"Send Eth\" parameters.");
        }
    }

    return (<>
        <h3>Send Eth</h3>
        <EthValueInput value={sendValue} setValue={setSendValue} />
        <Input label="Recipient" id="recipient" value={recipientAddress} setValue={setRecipientAddress} 
            inputProps={{placeholder: "Recipient Address"}} 
        />
        Sender
        <WalletDropdown wallets={wallets} setWallet={setChosenWallet} />
        <Button disabled={!sendValue || !recipientAddress || !chosenWallet} onClick={addTxToQueue} variant="link">Send Eth</Button>
        <Toast message="ETH transfer added to transaction queue." show={showToast} setShow={setShowToast} />
    </>)
}

export default SendEth;
