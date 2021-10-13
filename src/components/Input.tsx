import React, {FunctionComponent} from 'react';

type InputProps = {
    id: string,
    label?: string,
    value?: string,
    setValue: Function,
    inputProps?: any,
}

const Input: FunctionComponent<InputProps> = ({id, label, value, setValue, inputProps}) => {
    const inputPropOverrides = {
        type: "text", // default value, can be overridden by inputProps
        ...inputProps,
    };
    return (<>
        {label && <label htmlFor={id}>{label}</label>}
        <div>
            <input id={id} onChange={(e) => setValue(e.target.value)} value={value || ""} {...inputPropOverrides} />
        </div>
    </>)
}

export default Input;
