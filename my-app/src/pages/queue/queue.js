import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Form,Button,Container,Dropdown,Spinner} from "react-bootstrap"

var domain = `ws://localhost:8000`

const handleAscii = (str) => {
    return str.replace(" ",'_')
}

const Queue = () => {
    useEffect(() => {document.body.style.backgroundColor = "#333b52"});
    const [sock,setSock] = useState();
    const [hasName,setHasName] = useState(false);
    const [name,setName] = useState("");
    const [game,setGame] = useState("Choose a Game");
    const [ready,setReady] = useState(false);
    const [cdata,setCDATA] = useState(false)
    const spinner = <Spinner animation="border" variant="primary" role="status" style={{"width" : "200px","height" : "200px"}}><span className="sr-only">Loading...</span></Spinner>;

    const handleMessage = (event) => {
        let msg = JSON.parse(event.data);
        if(msg.connect){
            console.log(msg);
            setCDATA([msg.position,msg.client_num])
        }
    }

    useEffect(() => {
        if(!hasName) return;
        const socket = new WebSocket(domain + '/queue');
        setSock(socket);
    },[hasName]);

    useEffect(() => {
        if(sock===undefined) return () => {}
        sock.onmessage = (data) => {handleMessage(data)}
        sock.onclose = () => {console.log("socket closed")}
        sock.onopen = () => {console.log("connection opened")}
    })

    const handleSubmit = () => {
        let username = document.getElementById(`usr`).value;
        document.cookie = `username=${username}`
        console.log("Username is " + username);
        setHasName(true);setReady(true);
    }

    return (
        <Container style={{"maxWidth" : "470px"}}>
            <Form onSubmit={(e) => {e.preventDefault();handleSubmit(e)}}>
            <Form.Group>
                <Form.Label style={{"color" : "#eaeaea"}}>Enter your Username.</Form.Label>
                <Form.Control id={`usr`} value={name} maxLength={16} onChange={(e) => {setName(handleAscii(e.target.value));}} type="text" placeholder="" disabled={ready}/>
                <Form.Text className="text-muted">
                The temporary username that will be used.
               </Form.Text>
            </Form.Group>
            <div>
                <Button style={{"float" : "left"}} variant="primary" type="submit" disabled={!ready && name.length > 0 && game !== "Choose a Game"  ? false : true}>
                    Continue as "{name}".
                </Button>

                <Dropdown style={{"float" : "right"}} >
                    <Dropdown.Toggle variant="success" id="dropdown-basic" disabled={ready}>
                        {game}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setGame("Drawing")} href="#">Drawing</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            </Form>
            {!ready ?  '' : <div style={{'textAlign' : "center",fontFamily : "sans-serif"}}>{spinner}<label style={{"color" : "#eae2e2",marginTop : "20px"}}>Waiting for <b style={{"color" : "#007bff"}}>{4-cdata[1]}</b> more players to connect.</label></div>}
        </Container>
    )
}


export default Queue;