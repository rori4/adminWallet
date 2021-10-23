import React, { useState, FunctionComponent } from 'react';
import Dropdown from "react-bootstrap/Dropdown";

// lib
import { WalletResponse } from '../lib/cache/wallets';

type WalletDropdownProps = {
    wallets: WalletResponse[],
    setWallet: Function,
}

const WalletDropdown: FunctionComponent<WalletDropdownProps> = ({wallets, setWallet}) => {
    const [chosenWallet, setChosenWallet] = useState<WalletResponse>();
    return (<Dropdown>
        <Dropdown.Toggle>{chosenWallet ? chosenWallet.name : "Choose a Wallet"}</Dropdown.Toggle>
        <Dropdown.Menu>
            {wallets.map((wallet, idx) => (
                <Dropdown.Item key={idx} onClick={() => {
                    setChosenWallet(wallet);
                    setWallet(wallet);
                }}>{wallet.name}</Dropdown.Item>
            ))}
            
        </Dropdown.Menu>
    </Dropdown>)
}

export default WalletDropdown;
