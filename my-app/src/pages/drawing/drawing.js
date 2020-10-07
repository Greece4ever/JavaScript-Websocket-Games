// import React from 'react';
// import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
import React,{useEffect,useState} from "react"
import "./base.css"
import {Form,Container} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import useAuthentication from "../authentication";
import Display from "./user_display";
import ColorPicker from "./color_picker";

// TODO ----> https://www.pornhub.com/view_video.php?viewkey=ph5f06e9657a805#1

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

export default function Drawing() {
  useAuthentication();
  const [drawing,setDrawing] = useState(false);
  const [LineWidth,setLineWidth] = useState(10);
  const [caligraphy,setCaligrapgy] = useState(0);
  const [color,setColor] = useState("#000000");
  const [keys,setKeys] = useState(false);
  const [paths,setPaths] = useState([]);
  const [keyPress,No] = useState({
    65 : () => setLineWidth(prev => prev + 1),
    68 : () => setLineWidth(prev => prev - 1),
    87 : () => setCaligrapgy(prev => prev + 1),
    83 : () => setCaligrapgy(prev => prev - 1),
    67 : () => {let pick = document.getElementById("pick");pick.style.visibility = "visible";pick.click();pick.style.visibility = "hidden";}
  });
  const [undo,setUndo] = useState(false);
  const [socket,setSocket] = useState();
  const [players,setPlayers] = useState([]);
  const [msgs,setMSG] = useState([]);
  const [gradient,setGradient] = useState([]);

  const drawData = (x,y,lineWidth,strokeStyle) => {
    const canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");  
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle  = strokeStyle;
    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-caligraphy,y-caligraphy);
    canvas.getContext("2d").beginPath();
  } 

  useEffect(() => {
    let PORT = 8000;
    const socket = new WebSocket(`ws://${window.location.hostname}:${PORT}/drawing`);
    setSocket(socket);

    socket.onConnect = () => {}

    socket.onmessage = (msg) => {
      let data =  JSON.parse(msg.data)
      if(typeof(data)==='string') data = JSON.parse(data);

      if(data.type===2) {
        let d = data.value;
        drawData(d[0],d[1],d[2],d[3]);
        return;
      }

      // Handle New Connection
      if(data.type === 0) {
        let color = data.color
        setPlayers(prev => [...prev,{
          "username" : data.username,
          "img" : data.img,
          "score" : data.score,
          "color" : `rgba(${color[0]},${color[1]},${color[2]},0.4)`
        }])
        return;}
      
      else if(data.type === 1) {
        setMSG(prev => [...prev,data])
      }

    }

    socket.onclose = () => {
      console.log("closed")
    }

    socket.onerror = () => {
      console.log("error")
    }

  },[])

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    canvas.setAttribute("tabindex", 0);
  })

  const clearCanvas = () => {
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0,0,document.getElementById("canvas").width,document.getElementById("canvas").height);
  }

  const redraw = () => {
    clearCanvas();
    if(paths.length === 0) return null;
    const canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.lineCap = "round";

    paths.forEach(bitdata => {
      ctx.beginPath();
      
      // Define Color and Width
      ctx.lineWidth = bitdata[2];
      ctx.strokeStyle = bitdata[3];

      ctx.lineTo(bitdata[0],bitdata[1]);
      ctx.stroke();
      ctx.beginPath();  
      ctx.moveTo(bitdata[0],bitdata[1]);

    })
  }

  useEffect(() => {
    redraw();    
  },[undo])


  // Draw on Screen
  const handleMove = (e) => { 
    const canvas = document.getElementById("canvas");
    if(!drawing) return null;
    let ctx = canvas.getContext("2d");

    // Settings
    ctx.lineCap = "round";
    ctx.lineWidth = LineWidth;
    ctx.strokeStyle  = color;
    let [x,y] = [e.clientX-20,e.clientY-80]
    if(keys){
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, 2 * Math.PI);
      ctx.stroke()
      return;
    }
    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-caligraphy,y-caligraphy)
    socket.send(JSON.stringify(
      {type : 2, value : [x,y,LineWidth,color]}
      ))

    // console.log(paths)
  }

  // Change Paint styles
  const handleKeyPress = (e) => {
    if(e.keyCode===65){
      setLineWidth(prev => prev +1)
    }
    else if(e.keyCode==68){
      setLineWidth(prev=>prev-1)
    }
    else if (e.keyCode===87){
      setCaligrapgy(prev => prev +1)
    }
    else if (e.keyCode===83){
      setCaligrapgy(prev => prev-1)
    }
    else if (e.keyCode===67){
      let pick = document.getElementById("pick");
      pick.style.visibility = "visible";
      pick.click();pick.style.visibility = "hidden"
    }
  }

  // Cut and Undo && Key Presses
  const handleKeyDown = (e) => {
    let f = keyPress[e.keyCode]
    if(f !== undefined){
      return f();
    }

    if(e.keyCode === 17){
      setKeys(true)
    }

    // Undo
    else if (e.keyCode === 90 && keys){
      setPaths(prev => prev.slice(0,prev.length-2));
      setUndo(prev => !prev);
    }

    // Clear
    else if (e.keyCode === 88 && keys){
      clearCanvas();setPaths(prev => []);
    }

    // Reset
    else if (e.keyCode === 77 && keys){
      setCaligrapgy(0);
      setLineWidth(10);
      setColor("#000000");
    }

  }

  const handleKeyUp = (e) => {
    if(e.keyCode === 17){
      setKeys(false);
    }
  }

  return (
    <Container style={{maxWidth: "1500px"}} >
      <div style={{"marginLeft" : "20px",marginTop : "10px"}}>
        {players.map(player => (
          <Display m_left={players.indexOf(player)==0 ? 0 : '10px'} color={player.color} username={player.username} score={player.score} image={`http://localhost:8000/${player.img}`} />
        ))}
        <span style={{"visibility" : "hidden"}}>hello world</span>
      </div>
      <div class="css" style={{float : "left",height : "600px",width : "300px",marginLeft : "20px",marginTop : "10px",position : "relative"}}>
        <ColorPicker />
      </div>
      <canvas className={"cs"} style={{"float" : "left",cursor : "crosshair",marginLeft : "20px",marginTop : "10px",backgroundColor : "aliceblue"}} onKeyDown={e => handleKeyPress(e)}
       onMouseUp={() =>  {setDrawing(false);document.getElementById("canvas").getContext("2d").beginPath()}}
       onKeyDown={(e) => handleKeyDown(e)} 
       onKeyUp={(e) => handleKeyUp(e)}
       onMouseDown={() => setDrawing(true)} 
       onMouseMove={(e) => {handleMove(e)}} width={800} height={600} id="canvas"></canvas>
      <div style={{"float" : "right",resize : "none",marginRight : "50px"}}>
        <div className={"css"} style={{height : "421px",width : "250px",backgroundColor : "transparent"}}>
          {msgs.map(m => (
            <div>
              <label className={"text-muted"}>{m.date}&nbsp;</label>
              <label style={{"color" : `rgba(${m.color[0]},${m.color[1]},${m.color[2]})`}}>{m.username}</label>
              <label>&nbsp;:&nbsp;</label>
              <label>{m.value}</label>
            </div>
          ))}
        </div>
        <Form.Group style={{"marginTop" : "30px"}}  controlId="exampleForm.ControlTextarea1">
          <Form.Control onKeyDown={(e) => {
            if(e.key==='Enter' || e.keyCode===13 || e.which===13){
              e.preventDefault();
              socket.send(JSON.stringify({"type" : 1,'value' : e.target.value}))}}} 
              style={{"resize" : "none","maxHeight" : "50px",        
              background : "radial-gradient(#07071e, transparent)",
              backgroundColor : "#2e343a",
              border : "1px solid #333b52"}} as="textarea" rows="3" />
        </Form.Group>
      </div>
      <div>
        <input onChange={(e) => {setColor(e.target.value)}} id="pick" 
        style={{"backgroundColor" : "transparent",
        border : "0",height : "0px",width : "0px",
        position : "fixed","visibility" : "hidden",
        }} type="color"></input>
      </div>
    </Container>
  );
};