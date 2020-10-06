import React from 'react';
import {Popover,OverlayTrigger} from "react-bootstrap";

const Display = (props) => {
    let overlay = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">{props.username}</Popover.Title>
            <Popover.Content>
              <strong>SCORE</strong> : <b>{props.score}</b>
           </Popover.Content>
        </Popover>)

    return(
        <OverlayTrigger trigger="click" placement="right" overlay={overlay}>
          <img style={{"width" : "64px",border : `3px solid ${props.color}`,cursor : "pointer",marginLeft : props.m_left}} src={props.image}></img>
        </OverlayTrigger>
    )
}

export default Display;