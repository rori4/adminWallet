import React, { FunctionComponent, useState } from 'react';
import Button from "react-bootstrap/Button";

// components
import Input from './Input';

// lib
import { addWallet as addWalletToCache, WalletResponse } from "../lib/cache/wallets";
import { Card } from 'react-bootstrap';

type WalletsProps = {
    wallets?: WalletResponse[],
    setWallets: Function,
}

const Wallets: FunctionComponent<WalletsProps> = ({wallets, setWallets}) => {
    const NewSigner = () => {
        const [walletName, setWalletName] = useState<string>();
        const [privateKey, setPrivateKey] = useState<string>();
        const addSigner = async () => {
            if (privateKey) {
                let freshWallets = await addWalletToCache(privateKey, walletName);
                setWallets(freshWallets);
            }
            // hardhat private key
            // ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
        }

        return (<>
            <Input value={walletName} setValue={setWalletName} id="wallet-name" inputProps={{placeholder: "nickname", autoComplete: "off"}} />
            <Input value={privateKey} setValue={setPrivateKey} id="private-key" inputProps={{type: "password", placeholder: "private key", autoComplete: "off"}} />
            <Button onClick={addSigner} disabled={!privateKey}>Add Signer</Button>
        </>)
    }

    return (<>
        <h3>Wallets</h3>
        <NewSigner />
        <hr />
        {wallets && wallets.map((wallet, idx) => (
            <Card key={idx}>
                <Card.Body>
                    {wallet.name && <Card.Title>{wallet.name}</Card.Title>}
                    <p key={idx}>{wallet.wallet.address}</p>
                </Card.Body>
            </Card>
        ))}
    </>)
};

export default Wallets;
