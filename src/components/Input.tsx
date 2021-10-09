import React, {FunctionComponent} from 'react';

type InputProps = {
    id: string,
    label?: string,
    value?: string,
    setValue: Function
}

const Input: FunctionComponent<InputProps> = ({id, label, value, setValue}) => {
    return (<>
        {label && <label htmlFor={id}>{label}</label>}
        <div>
            <input id={id} type="text" onChange={(e) => setValue(e.target.value)} value={value || ""} />
        </div>
    </>)
}

export default Input;
