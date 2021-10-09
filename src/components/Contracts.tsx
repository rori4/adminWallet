import React, { FunctionComponent, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import { Contract } from "ethers";

// components
import FunctionDrawer from "./FunctionDrawer";
import Input from "./Input";

// lib
import { addContract as addContractToCache } from "../lib/cache";

type ContractsProps = {
    contracts?: Contract[],
    setContracts: Function,
    activeContract?: Contract,
    setActiveContract: Function,
}

const Contracts: FunctionComponent<ContractsProps> = ({contracts, setContracts, activeContract, setActiveContract}) => {
    const [contractAddress, setContractAddress] = useState<string>();
    const addContract = async () => {
        if (contractAddress) {
          const freshContracts = await addContractToCache(contractAddress);
          setContracts(freshContracts);
        }
      }
    return (<>
    <h3>Contracts</h3>
    <Input label="Add Contract" value={contractAddress} setValue={setContractAddress} id="contractAddress" />
    <Button disabled={!contractAddress} size="sm" onClick={() => {addContract(); setContractAddress(undefined);}}>Add Contract</Button>
    
    {contracts && contracts.length > 0 && <>
        <hr />
        <Dropdown>
        <Dropdown.Toggle variant="link" id="contract-dropdown">{activeContract?.address || "Choose a contract"}</Dropdown.Toggle>
        <Dropdown.Menu>
            {contracts.map((contract, idx) => <Dropdown.Item key={idx} onClick={() => setActiveContract(contract)}>{contract.address}</Dropdown.Item>)}
        </Dropdown.Menu>
        </Dropdown>
    </>}
    {
        activeContract && <>
        <Card>
            <Card.Body>
                <Card border="light">
                    <Card.Body>
                        <Card.Title>Contract Address</Card.Title>
                        <code>{activeContract.address}</code>
                    </Card.Body>
                </Card>
                {Object.keys(activeContract.interface.functions)
                .filter(key => key.endsWith(")"))
                .map((functionName, idx) => (
                    <div key={idx}>
                    <FunctionDrawer functionName={functionName} contract={activeContract} />
                    </div>
                ))}
            </Card.Body>
        </Card>
    </>}
</>)}

export default Contracts;
