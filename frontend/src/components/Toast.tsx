import React, { FunctionComponent } from 'react';
import Toast from "react-bootstrap/Toast";

type ToastProps = {
    message: string,
    show: boolean,
    setShow: Function,
}

const CustomToast: FunctionComponent<ToastProps> = ({message, show, setShow}) => {
    return (<Toast bg="info" show={show} autohide={true} delay={3000} onClose={() => setShow(false)} style={{position: "fixed", bottom: 24, right: 16}}>
        <Toast.Body style={{color: "white", textShadow: "1px 1px #666"}}>{message}</Toast.Body>
    </Toast>)
}

export default CustomToast;
