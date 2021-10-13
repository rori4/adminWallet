import React, { FunctionComponent, useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import { Wallet } from "ethers";

// components
import Input from './Input';

type SignersProps = {
    signers?: Wallet[],
    setSigners: Function,
}

const Signers: FunctionComponent<SignersProps> = ({signers, setSigners}) => {
    useEffect(() => {
        //
    }, [signers]);

    const NewSigner = () => {
        const [privateKey, setPrivateKey] = useState<string>();
        const addSigner = () => {
            if (privateKey) {
                try {
                    const signer = new Wallet(privateKey);
                    let newSigners = signers || [];
                    newSigners.push(signer);
                    setSigners(newSigners);
                } catch (e) {
                    console.error("invalid private key", e);
                }
            }
            //
            
        }
        return (<>
            <Input value={privateKey} setValue={setPrivateKey} id="private-key" inputProps={{type: "password", placeholder: "private key", autoComplete: "off"}} />
            <Button onClick={addSigner} disabled={!privateKey}>Add Signer</Button>
        </>)
    }

    return (<>
        <h3>Signers</h3>
        <NewSigner />
        <hr />
        {signers?.map((signer, idx) => (
            <p key={idx}>{signer.address}</p>
        ))}
    </>)
};

export default Signers;
