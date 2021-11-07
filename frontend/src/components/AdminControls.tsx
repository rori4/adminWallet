import React, { FunctionComponent, useState } from 'react';

// components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

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

    return (
    <Card border="light" bg="secondary" text="light">
        <Card.Body>
            <Card.Title>Admin Controls</Card.Title>
            <Button variant="danger" onClick={() => {flush(); setContracts(undefined); setActiveContract(undefined);}}>Flush Cache</Button>
            <hr />
            <Input value={providerUrl} setValue={setProviderUrl} id="provider_url" label="Provider URL" />
            <Button variant="light" onClick={updateProvider}>Set Provider</Button>
        </Card.Body>
    </Card>
)};

export default AdminControls;
