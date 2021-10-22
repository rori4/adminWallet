import React, { FunctionComponent, useEffect, useState } from 'react';
import { Contract, utils, providers } from "ethers";
import { Button, Card } from "react-bootstrap";

const triggerCall = async (contract: Contract, functionName: string, args: any[], setResult: Function, provider: providers.BaseProvider) => {
    const trueName = contract.interface.getFunction(functionName).name;
    const tx = await contract.populateTransaction[trueName](...args);
    const res = await provider.call(tx);
    try {
      setResult(utils.toUtf8String(res));
    } catch (e) {
      setResult(res.toString());
    }
};

type FunctionDrawerProps = {
  contract: Contract, 
  functionName: string,
  provider: providers.BaseProvider | providers.JsonRpcProvider,
}

const FunctionDrawer: FunctionComponent<FunctionDrawerProps> = ({ contract, functionName, provider }) => {
    // stores input values
    const [args, setArgs] = useState<string[]>([]);
    const [result, setResult] = useState<string>();
    const rawArgs = contract.interface.fragments.find(fragment => functionName.startsWith(fragment.name))?.inputs;
    const functionSpec = contract.interface.getFunction(functionName);

    const buttonAction = (isCall: boolean) => {
      if (isCall) {
        console.log("CALLING DIRECTLY");
        triggerCall(contract, functionName, args, setResult, provider)
      } else {
        console.log("ADD TO QUEUE");
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
        <Button variant="link" onClick={() => buttonAction(functionSpec.constant)}>{functionName}</Button>
      </Card.Body>
    </Card> : <></>
    )
};

export default FunctionDrawer;
