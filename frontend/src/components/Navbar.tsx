import React, { FunctionComponent } from 'react';
import { 
    Container,
    Nav, 
    Navbar, 
    Offcanvas 
} from "react-bootstrap";

// app components
import AdminControls from "./SystemSettings";

type NavProps = {
    setActiveContract: Function,
    setContracts: Function,
}

const Navigation: FunctionComponent<NavProps> = ({setContracts, setActiveContract}) => {
    return (<Container>
    <Navbar bg="light" variant="light" sticky="top" expand={false}>
        <Container fluid={true}>
            <Navbar.Brand>adminWallet</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">System Settings</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <AdminControls setActiveContract={setActiveContract} setContracts={setContracts} />
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
    </Navbar></Container>);
}

export default Navigation;
