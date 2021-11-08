import React, {FunctionComponent} from 'react';
import { InputGroup, FormControl } from "react-bootstrap";

type InputProps = {
    id: string,
    label?: string,
    value?: string,
    setValue: Function,
    inputProps?: any,
    prependText?: string,
    appendElement?: any,
    appendText?: string,
}

const Input: FunctionComponent<InputProps> = ({id, label, value, setValue, inputProps, prependText, appendElement, appendText}) => {
    const inputPropOverrides = {
        type: "text", // default value, can be overridden by inputProps
        ...inputProps,
    };
    return (<>
        {label && <label htmlFor={id}>{label}</label>}
        <InputGroup className="mb-3">
            {prependText && <InputGroup.Text>{prependText}</InputGroup.Text>}
            <FormControl id={id} onChange={(e) => setValue(e.target.value)} value={value || ""} {...inputPropOverrides} />
            {appendElement}
            {appendText && <InputGroup.Text>{appendText}</InputGroup.Text>}
        </InputGroup>
    </>)
}

export default Input;
