import React, { FunctionComponent, useEffect, useState } from 'react';
import { Contract } from "ethers";
import { Button, Card } from "react-bootstrap";

// lib
import { WalletResponse } from '../lib/cache/wallets';
import WalletDropdown from './WalletDropdown';
import { triggerCall, EthProvider } from "../lib/ethereum";

type FunctionDrawerProps = {
  contract: Contract, 
  functionName: string,
  provider: EthProvider,
  queueTx: Function,
  wallets: WalletResponse[],
}

const FunctionDrawer: FunctionComponent<FunctionDrawerProps> = ({ contract, functionName, provider, queueTx, wallets }) => {
    // stores input values
    const [args, setArgs] = useState<string[]>([]);
    const [result, setResult] = useState<string>();
    const [chosenWallet, setChosenWallet] = useState<WalletResponse>();
    const rawArgs = contract.interface.fragments.find(fragment => functionName.startsWith(fragment.name))?.inputs;
    const functionSpec = contract.interface.getFunction(functionName);

    const buttonAction = (isCall: boolean) => {
      if (isCall) {
        console.log("CALLING DIRECTLY");
        triggerCall(contract, functionName, args, setResult, provider)
      } else {
        console.log("ADDING TX TO QUEUE");
        queueTx(contract, functionName, args, provider, chosenWallet);
      }
    }

    useEffect(() => {
      // read function params, make inputs for each and assign values to args
      let initArgs: string[] = [];
      rawArgs?.forEach(arg => {
        initArgs.push("");
      });
      setArgs(initArgs);
    }, [rawArgs]);

    return (contract && rawArgs ? <Card border="light">
      <Card.Body>
        <Card.Title>{functionName}{functionSpec && functionSpec.payable && <em style={{ color: 'green', padding: 6 }}>Payable</em>}</Card.Title>
        <Card.Subtitle>{functionSpec.constant ? "Call" : "Send"}</Card.Subtitle>
        {rawArgs.map((arg, idx) => {
          let id = `${functionName}.${arg.name}`;
          return (<div key={idx}>
            <input id={id} type="text" placeholder={arg.name} onChange={(e) => {
              let thisArgs = args;
              thisArgs[idx] = e.target.value;
              setArgs(thisArgs);
            }} />
          </div>)
        })}
        {result && <p><code>{result}</code></p>}
        {!functionSpec.constant && <WalletDropdown wallets={wallets} setWallet={setChosenWallet} />}
        <Button disabled={!functionSpec.constant && !chosenWallet} variant="link" onClick={() => buttonAction(functionSpec.constant)}>{functionName}</Button>
      </Card.Body>
    </Card> : <></>
    )
};

export default FunctionDrawer;
