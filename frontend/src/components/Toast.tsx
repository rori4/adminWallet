import React, { FunctionComponent } from 'react';
import Toast from "react-bootstrap/Toast";

type ToastProps = {
    message: string,
    show: boolean,
    setShow: Function,
}

const CustomToast: FunctionComponent<ToastProps> = ({message, show, setShow}) => {
    return (<Toast show={show} autohide={true} delay={3000} onClose={() => setShow(false)} style={{position: "fixed", bottom: 24, right: 16}}>
        <Toast.Body>{message}</Toast.Body>
    </Toast>)
}

export default CustomToast;
