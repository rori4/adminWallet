import React, { FunctionComponent } from 'react';
import Dropdown from "react-bootstrap/Dropdown";

// lib
import { WalletResponse } from '../lib/cache/wallets';

type WalletDropdownProps = {
    wallets: WalletResponse[],
    setWallet: Function,
}

const WalletDropdown: FunctionComponent<WalletDropdownProps> = ({wallets, setWallet}) => {
    return (<Dropdown>
        <Dropdown.Toggle>Choose a Wallet</Dropdown.Toggle>
        <Dropdown.Menu>
            {wallets.map((wallet, idx) => (
                <Dropdown.Item key={idx} onClick={() => setWallet(wallet)}>{wallet.name}</Dropdown.Item>
            ))}
            
        </Dropdown.Menu>
    </Dropdown>)
}

export default WalletDropdown;
