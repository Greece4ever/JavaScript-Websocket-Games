import React,{useState,useEffect} from 'react';
import {Form,Button,Container,Dropdown,Spinner,Alert} from "react-bootstrap"

var domain = `ws://localhost:8000`;

var clearCookies = () => {
    return document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

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
    const [error,setError] = useState('');
    const spinner = <Spinner animation="border" variant="primary" role="status" style={{"width" : "200px","height" : "200px"}}><span className="sr-only">Loading...</span></Spinner>;
    let MAX_PLAYERS = 2;
    const [move,setMove] = useState(false)

    const handleMessage = (event) => {
        let msg = JSON.parse(event.data);
        if(msg.connect){
            setError('');
            if(msg.key) {
                setMove(msg.key);
                return;
            }
            setCDATA(msg.client_num);
        } else {
            let c_num = msg.client_num;
            if(c_num==MAX_PLAYERS-1){
                console.log("WE SHALL MOVE TO",msg.key);
                setMove(msg.key)
        }
            setCDATA(msg.client_num)
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
        sock.onerror = () => {
            console.log("err")
            setError(true);setHasName(false);setReady(false);
        }
        sock.onopen = () => {console.log("connection opened")}
    })

    const handleSubmit = () => {
        let username = document.getElementById(`usr`).value;
        document.cookie = `username=${username}`;
        setHasName(true);setReady(true);
    }

    return (
        <Container style={{"maxWidth" : "470px"}}>
            {error.length==0 ? '' : <Alert variant={"danger"} style={{"backgroundColor" : "rgb(69, 44, 47)",border : 0,color : "rgb(255, 181, 187)",marginTop : "10px"}}>Username "{name}" Already exists in lobby.</Alert>}
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
    {move ?   <div style={{marginTop : "100px",'textAlign' : "center",fontFamily : "sans-serif"}}>{spinner}<label style={{"color" : "#eae2e2",marginTop : "20px"}}>Moving to <b style={{"color" : "#eae2e2"}}>{move}</b>.</label></div> :  
            !ready ?  '' : <div style={{marginTop : "100px",'textAlign' : "center",fontFamily : "sans-serif"}}>{spinner}<label style={{"color" : "#eae2e2",marginTop : "20px"}}> Waiting for <b style={{"color" : "#007bff"}}>{MAX_PLAYERS-cdata-1} </b> more players to connect on game <b style={{"color" : "#007bff"}}>{game}</b>.</label></div>}
        </Container>
    )
}


export default Queue;