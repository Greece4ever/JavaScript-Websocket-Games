import React from 'react';
import {Card} from "react-bootstrap";
import "./base.css";

export default function MPCard(props) {
    return(
    <Card style={{ width: '18rem',height : '30rem',borderRadius : 0,border : "5px solid #333",position : "relative" }}>
        <div style={{backgroundColor : props.color,position : "absolute",top : "0",right : "0",width : "100%",height : "15%",borderBottom : "5px solid #333"}}>
            <div style={{visibility : "hidden"}}>.</div>
        </div>
    <Card.Body style={{marginTop : "50px",backgroundColor : "#BFDBAE"}}>
        <Card.Text style={{marginTop : "30px"}}>
        <b style={{"fontSize" : "30px",display : "inline-block",fontFamily : "'Piazzolla', serif",textAlign : "center"}}>{props.text}</b>
        </Card.Text>
        <div style={{"position" : "absolute","bottom" : "0",left : "50%",transform : "translateX(-50%)"}}>
            <b style={{"fontSize" : "30px"}}>₩{props.price}</b>
        </div>
    </Card.Body>
    </Card>)
}