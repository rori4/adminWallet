import React, { FunctionComponent, useEffect, useState } from 'react';
import { Contract } from "ethers";
import { Button, Card, Form } from "react-bootstrap";

// app components
import Input from './Input';
import Toast from "./Toast";

// lib
import { WalletResponse } from '../lib/cache/wallets';
import WalletDropdown from './WalletDropdown';
import { triggerCall, EthProvider } from "../lib/ethereum";
import EthValueInput from './EthValueInput';

type FunctionDrawerProps = {
  contract: Contract, 
  functionName: string,
  provider: EthProvider,
  queueTx: Function,
  wallets: WalletResponse[],
}

const FunctionDrawer: FunctionComponent<FunctionDrawerProps> = ({ contract, functionName, provider, queueTx, wallets }) => {
    // toast state
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>();
	
	// stores input values
    const [args, setArgs] = useState<string[]>([]);
    const [ethValue, setEthValue] = useState<string>(); // value for payable functions
    const [result, setResult] = useState<string>(); // call-type function result
    const [chosenWallet, setChosenWallet] = useState<WalletResponse>();
	const [gasLimit, setGasLimit] = useState<string>();
	const [useAutoGasLimit, setUseAutoGasLimit] = useState(true);
    const rawArgs = contract.interface.fragments.find(fragment => functionName.startsWith(fragment.name))?.inputs;
    const functionSpec = contract.interface.getFunction(functionName);

    const buttonAction = (isCall: boolean) => {
		if (isCall) {
			console.log("CALLING DIRECTLY");
			triggerCall(contract, functionName, args, setResult, provider)
		} else {
			console.log("ADDING TX TO QUEUE");
			queueTx(contract, functionName, args, provider, chosenWallet, ethValue, gasLimit);
			setToastMessage(`Added ${functionName} transaction to queue.`)
			setShowToast(true);
		}
    }

    useEffect(() => {
		// read function params, make inputs for each and assign values to args
		if (!args) {
			let initArgs: string[] = [];
			rawArgs?.forEach(arg => {
				initArgs.push("");
			});
			setArgs(initArgs);
		}
    }, [args, rawArgs, toastMessage, useAutoGasLimit]);

    return (<>
		{contract && rawArgs && <Card border="dark">
			<Card.Body>
				<Card.Title>{functionName}{functionSpec && functionSpec.payable && <em style={{ color: 'green', padding: 6 }}>Payable</em>}</Card.Title>
				<Card.Subtitle>{functionSpec.constant ? "Call" : "Send"}</Card.Subtitle>
				{functionSpec.payable && <EthValueInput value={ethValue} setValue={setEthValue} />}
				{rawArgs.map((arg, idx) => {
					let id = `${functionName}.${arg.name}`;
					return (<div key={idx}>
						<Input id={id} inputProps={{placeholder: arg.name}} value={args[idx]} setValue={(val: string) => {
						let thisArgs = [...args];
						thisArgs[idx] = val;
						setArgs(thisArgs);
						}} />
					</div>)
				})}
				{result && <p><code>{result}</code></p>}
				{!functionSpec.constant && <Form.Check type="switch" id="gas-limit-switch" label="Auto Gas Limit" defaultChecked={useAutoGasLimit} onChange={() => setUseAutoGasLimit(!useAutoGasLimit)} />}
				{(useAutoGasLimit === false && !functionSpec.constant) && <Input value={gasLimit} setValue={setGasLimit} label="Gas Limit" id="gas-limit" />}
				{!functionSpec.constant && <WalletDropdown wallets={wallets} setWallet={setChosenWallet} />}
				<Button disabled={!functionSpec.constant && !chosenWallet} variant="link" onClick={() => buttonAction(functionSpec.constant)}>{functionName}</Button>
			</Card.Body>
		</Card>}
		<Toast show={showToast} setShow={setShowToast} message={toastMessage || ""} />
    </>)
};

export default FunctionDrawer;
