import React, { FunctionComponent, useEffect, useState } from 'react';
import { Contract, utils, providers } from "ethers";
import { Button, Card } from "react-bootstrap";

const triggerCall = async (contract: Contract, functionName: string, args: any[], setResult: Function) => {
    const trueName = contract.interface.getFunction(functionName).name;
    const tx = await contract.populateTransaction[trueName](...args);
    const res = await providers.getDefaultProvider().call(tx);
    try {
      setResult(utils.toUtf8String(res));
    } catch (e) {
      setResult(res.toString());
    }
  }

const FunctionDrawer: FunctionComponent<{ contract: Contract, functionName: string }> = ({ contract, functionName }) => {
    // stores input values
    const [args, setArgs] = useState<string[]>([]);
    const [result, setResult] = useState<string>();
    const rawArgs = contract.interface.fragments.find(fragment => functionName.startsWith(fragment.name))?.inputs;
    const functionSpec = contract.interface.getFunction(functionName);

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
        <Button variant="link" onClick={() => triggerCall(contract, functionName, args, setResult)}>{functionName}</Button>
      </Card.Body>
    </Card> : <></>
    )
};

export default FunctionDrawer;
