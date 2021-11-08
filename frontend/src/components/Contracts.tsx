import React, { FunctionComponent, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import { Contract, providers } from "ethers";

// components
import FunctionDrawer from "./FunctionDrawer";
import Input from "./Input";
import { getContractName } from "./helpers";

// lib
import { addContract as addContractToCache, ContractResponse } from "../lib/cache/contracts";
import { WalletResponse } from "../lib/cache/wallets";

type ContractsProps = {
    contracts?: ContractResponse[],
    setContracts: Function,
    activeContract?: Contract,
    setActiveContract: Function,
    provider: providers.BaseProvider | providers.JsonRpcProvider,
    queueTx: Function,
    wallets: WalletResponse[],
}

const isCall = (contract: Contract, functionName: string) => (
    contract.interface.getFunction(functionName).constant
)

const Contracts: FunctionComponent<ContractsProps> = ({contracts, setContracts, activeContract, setActiveContract, provider, queueTx, wallets}) => {
    const [contractAddress, setContractAddress] = useState<string>();
    const addContract = async () => {
        if (contractAddress) {
          const freshContracts = await addContractToCache(contractAddress);
          setContracts(freshContracts);
        }
      }
    return (<>
        <h3>Contracts</h3>
        <Input label="Contract Address" value={contractAddress} setValue={setContractAddress} id="contractAddress" 
        inputProps={{placeholder: "contract address"}}
        appendElement={<Button disabled={!contractAddress} size="sm" onClick={() => {addContract(); setContractAddress(undefined);}}>Add Contract</Button>} />
        
        <hr />
        {contracts && contracts.length > 0 && <Dropdown style={{marginBottom: 16}}>
            <Dropdown.Toggle variant="link" id="contract-dropdown">{activeContract?.address || "Choose a contract"}</Dropdown.Toggle>
            <Dropdown.Menu>
                {contracts.map((contract, idx) => <Dropdown.Item key={idx} onClick={() => setActiveContract(contract.contract)}>
                    <code>{contract.contract.address}{contract.name && ` (${contract.name})`}</code>
                </Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>}
        {
            activeContract && <>
            <Card>
                <Card.Body>
                    <Card.Title>{getContractName(activeContract.address, contracts || [])}</Card.Title>
                    <Card border="light">
                        <Card.Body>
                            <Card.Title>Contract Address</Card.Title>
                            <code>{activeContract.address}</code>
                        </Card.Body>
                    </Card>
                    {Object.keys(activeContract.interface.functions)
                    .filter(key => key.endsWith(")"))
                    .sort((aName, bName) => (isCall(activeContract, aName) === isCall(activeContract, bName) ? 0 : isCall(activeContract, aName) ? -1 : 1))
                    .map((functionName, idx) => (
                        <div key={idx}>
                            <FunctionDrawer 
                                functionName={functionName} 
                                contract={activeContract} 
                                provider={provider} 
                                queueTx={queueTx} 
                                wallets={wallets}
                            />
                        </div>
                    ))}
                </Card.Body>
            </Card>
        </>}
    </>)
}

export default Contracts;
