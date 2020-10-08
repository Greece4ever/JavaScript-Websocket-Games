import React from 'react';

const Display = (props) => {
    return(
        <div style={{"background" : "red",width : "100px",background : "radial-gradient(black, transparent)",textAlign : "center",height : "130px"}}>
          <label style={{"fontFamily" : "'Comfortaa', cursive",color : "#909090"}}>{props.username}</label>
          <img alt={`${props.username}'s pic`} style={{"width" : "64px",border : `3px solid ${props.color}`,cursor : "pointer",marginLeft : props.m_left}} src={props.image}></img>
          <label style={{"fontFamily" : "'Comfortaa', cursive",color : "#909090"}}><span role={"img"} aria-label={"-->"}>➡️</span> {props.score} <span aria-label={"<--"} role={"img"}>⬅️</span></label>
        </div>
    )
}

export default Display;