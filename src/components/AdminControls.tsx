import React, { FunctionComponent } from 'react'

// components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

// lib
import { flush } from "../lib/cache";

type AdminControlsProps = {
    setContracts: Function;
    setActiveContract: Function;
}

const AdminControls: FunctionComponent<AdminControlsProps> = ({setContracts, setActiveContract}) => (
    <Card border="light" bg="secondary" text="light">
        <Card.Body>
        <Card.Title>Admin Controls</Card.Title>
        <Button variant="danger" onClick={() => {flush(); setContracts(undefined); setActiveContract(undefined);}}>Flush Cache</Button>
        </Card.Body>
    </Card>);

export default AdminControls;
