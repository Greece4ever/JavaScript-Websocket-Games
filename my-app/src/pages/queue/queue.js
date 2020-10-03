import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Form,Button,Container,Dropdown} from "react-bootstrap"

var domain = `ws://localhost:8000`

const handleAscii = (str) => {
    return str.replace(" ",'_')
}


const Queue = () => {
    const [sock,setSock] = useState()
    const [hasName,setHasName] = useState(false)
    const [name,setName] = useState("")
    const [game,setGame] = useState("Choose a Game")

    useEffect(() => {
        document.body.style.backgroundColor = "#333b52"
    })    

    // useEffect(() => {
    //     const socket = new WebSocket(domain + '/queue');
    //     setSock(socket);
    // },[]);

    // useEffect(() => {
    //     if(sock===undefined) return () => {}
    //     sock.onmessage = (data) => {console.log(data)}
    //     sock.onclose = () => {console.log("socket closed")}
    //     sock.onopen = () => {console.log("connection opened")}
    // })

    const handleSubmit = () => {
        let username = document.getElementById(`usr`).value;
        console.log("Username is " + username);
    }

    return (
        <Container style={{"maxWidth" : "470px"}}>
            <Form onSubmit={(e) => {e.preventDefault();handleSubmit(e)}}>
            <Form.Group>
                <Form.Label style={{"color" : "#eaeaea"}}>Enter your Username.</Form.Label>
                <Form.Control id={`usr`} value={name} maxlength={16} onChange={(e) => {setName(handleAscii(e.target.value));}} type="text" placeholder="" />
                <Form.Text className="text-muted">
                The temporary username that will be used.
               </Form.Text>
            </Form.Group>
            <div>
                <Button style={{"float" : "left"}} variant="primary" type="submit" disabled={name.length > 0 && game !== "Choose a Game"  ? false : true}>
                    Continue as "{name}".
                </Button>

                <Dropdown style={{"float" : "right"}}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {game}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setGame("Drawing")} href="#">Drawing</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            </Form>
        </Container>
    )
}


export default Queue;