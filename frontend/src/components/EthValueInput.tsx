import React, { FunctionComponent } from 'react';
import { utils } from "ethers";

// app components
import Input from "./Input";

type EthValueInputProps = {
    value?: string,
    setValue: Function,
}

const EthValueInput: FunctionComponent<EthValueInputProps> = ({value, setValue}) => (
    <Input label="Amount" id="send_value" value={value} setValue={setValue} 
        prependText="wei" 
        appendText={value && `${utils.formatEther(value)} ETH`}
        inputProps={{type: "number", placeholder: "ETH Amount (wei)"}} />
)

export default EthValueInput;
