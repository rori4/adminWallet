import React, { FunctionComponent, useState } from 'react';

// components
import Button from "react-bootstrap/Button";

// lib
import { flush } from "../lib/cache/cache";
import { getProviderUrl, setProviderUrl as setProviderUrlInCache } from '../lib/cache/provider';
import Input from './Input';

type AdminControlsProps = {
    setContracts: Function;
    setActiveContract: Function;
}

const AdminControls: FunctionComponent<AdminControlsProps> = ({setContracts, setActiveContract}) => {
    const [providerUrl, setProviderUrl] = useState<string>(getProviderUrl());

    const updateProvider = () => {
        setProviderUrlInCache(providerUrl);
        alert(`Provider set to ${providerUrl}`);
    }

    const flushCache = () => {
        flush(); 
        setContracts(undefined); 
        setActiveContract(undefined);
    }

    return (<>
        <Button variant="danger" onClick={flushCache}>Flush Cache</Button>
        <hr />
        <Input value={providerUrl} setValue={setProviderUrl} id="provider_url" label="Provider URL" />
        <Button variant="outline-primary" onClick={updateProvider}>Set Provider</Button>
    </>)
}

export default AdminControls;
