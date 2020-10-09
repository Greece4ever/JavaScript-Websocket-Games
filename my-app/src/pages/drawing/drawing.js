// import React from 'react';
// import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
import React,{useEffect,useState,useRef} from "react"
import "./base.css"
import {Form,Container,Row} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import Display from "./user_display";
import ColorPicker from "./color_picker";

// 2/10 Not recommended ----> https://www.pornhub.com/view_video.php?viewkey=ph5f06e9657a805#1

export default function Drawing() {
  const [drawing,setDrawing] = useState(false);
  const [drawingButMouseOutside,setDrawingButMouseOutsie] = useState(false);
  const [LineWidth,setLineWidth] = useState(10);
  const [caligraphy,setCaligrapgy] = useState(0);
  const [color,setColor] = useState([0,0,0]);
  const [keys,setKeys] = useState(false);
  const [paths,setPaths] = useState([]);
  const keyPress = {
    65 : () => setLineWidth(prev => prev + 1),
    68 : () => setLineWidth(prev => prev - 1),
    87 : () => setCaligrapgy(prev => prev + 1),
    83 : () => setCaligrapgy(prev => prev - 1),
  };
  const [connectionClose,setConnectionClose] = useState([]);
  const [leftDispatch,setLeftDispatch] = useState(false);
  const [opacity,setOpacity] = useState(0.5);
  const [undo,setUndo] = useState(false);
  const socket = useRef(null);
  const [players,setPlayers] = useState([]);
  const [msgs,setMSG] = useState([]);
  const [GMouse,setGMouse] = useState(false);

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

  // Handle Websocket
  useEffect(() => {
    let PORT = 8000;
    socket.current = new WebSocket(`ws://${window.location.hostname}:${PORT}/drawing`);

    socket.current.onconnect = () => {
      console.log("Connected to server")
    }

    socket.current.onmessage = (msg) => {
      console.log("message")
      let data = JSON.parse(msg.data);
      const type = data.type;
      delete data.type;
      switch(type){
          case 0: // Connect
              console.log("1 WAS CALLED")
              console.log(data)
              console.log(players)
              setPlayers(prev => [...prev,data])
              setMSG(prev => [
                ...prev,{"username" : data.username,"value" : "Has joined the chat!",date : Date.now(),color : data.color}
              ])
              break;
          case 1: // Chat 
              setMSG(prev => [...prev,data])
              break;
          case 2:
              break;
          case 3: // Disconnect
            console.log("DISCONNECT")
            setConnectionClose(prev => [...prev,data.id])
            console.log(data)
              break;
          case 4: // Connect and need data from all players
            console.log("4 WAS CALLED")
            setPlayers(data.data)
            break;
      }
  
    }

    socket.current.onclose = () => {
      console.log("closed")
    }

    socket.current.onerror = () => {
      console.log("error")
    }

    return () => {socket.current.close()}
  },[])


  // Handle Player exit
  useEffect(() => {
    console.log(connectionClose)
    if(!connectionClose) return;
    console.log("Connect closed")
    console.log(connectionClose)
    console.log(connectionClose.id)

    let pl_arr = players.filter(pl => {
      let bool = !connectionClose.includes(pl.id);
      if(bool) setMSG(prev => [...prev,{"username" : pl.username,"value" : "HAS LEFT THE CHAT!",date : Date.now(),color : pl.color}])
      return bool
    })

    console.log(pl_arr)
    setPlayers(pl_arr);
    setLeftDispatch(!leftDispatch);
  },[connectionClose])

  useEffect(() => {
    if(connectionClose.length < 1) return;
    console.log("DISPATCH WAS CALLED")
    setConnectionClose([]);
  },[leftDispatch])

  // Set canvas focus
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
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    paths.forEach(bitdata => {
      let [x,y] = [bitdata[0],bitdata[1]]

      // Define Color and Width
      ctx.lineWidth = bitdata[2];
      ctx.strokeStyle = bitdata[3];


      ctx.lineTo(x,y); // xy
      ctx.moveTo(x-bitdata[4],y-bitdata[4]);
      ctx.stroke();
      ctx.beginPath();
    })

  }

  useEffect(() => {
    redraw();    
    // setDrawing(false)
  },[undo])

  // Draw on Screen
  const handleMove = (e) => {
    e.preventDefault();
    const canvas = document.getElementById("canvas");
    if(!drawing) return null;
    let ctx = canvas.getContext("2d");
    let s = e.currentTarget.getBoundingClientRect();
    let [x,y] = [e.clientX,e.clientY];
    let [dx,dy] = [s.left,s.top];

    // Settings
    let s_style = `rgba(${color.join(",")},${opacity})`
    ctx.lineCap = "round";
    ctx.lineWidth = LineWidth;
    ctx.strokeStyle  = s_style;
    [x,y] = [x-dx,y-dy]
    if(keys){
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, 2 * Math.PI);
      ctx.stroke()
      return;
    }
    ctx.lineTo(x,y);
    if (paths.length > 2000) {
      console.log("paths is greater")
      setPaths(prev => [...paths.slice(1,paths.len),[x,y,LineWidth,s_style,caligraphy]])
    } else {
      setPaths(prev => [...prev,[x,y,LineWidth,s_style,caligraphy]])
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-caligraphy,y-caligraphy)
    // socket.send(JSON.stringify(
    //   {type : 2, value : [x,y,LineWidth,color]}
    //   ))

    // console.log(paths)
  }

  // Change Paint styles
  const handleKeyPress = (e) => {
    if(e.keyCode===65){
      setLineWidth(prev => prev +1)
    }
    else if(e.keyCode===68){
      setLineWidth(prev=>prev-1)
    }
    else if (e.keyCode===87){
      setCaligrapgy(prev => prev +1)
    }
    else if (e.keyCode===83){
      setCaligrapgy(prev => prev-1)
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
      console.log(paths)
      setPaths(prev => prev.slice(0,prev.length-20));
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
    <div style={{position : "fixed",width : "100%",height : "100%"}}
    onMouseDown={() => {
      setGMouse(true);
    }}
    onMouseUp={() => {
      setGMouse(false);
    }}
    
    onMouseLeave={() => {
      setGMouse(false);
    }}>
      <Container style={{maxWidth: "1500px"}}>
        <button onClick={() => console.log(connectionClose)}>PRINT</button>
        <Row style={{"marginLeft" : "20px",marginTop : "10px"}}>
          {players.map(player => (
            <Display m_left={players.indexOf(player)===0 ? 0 : '10px'} color={player.color} username={player.username} score={player.score} image={`http://localhost:8000/${player.img}`} />
          ))}
        </Row>
        <div className="css" style={{float : "left",height : "600px",width : "300px",marginLeft : "20px",marginTop : "10px",position : "relative"}}>
          <ColorPicker GMouse={GMouse} setParentColor={setColor} opacity={opacity} setOpacity={setOpacity} setLineWidth={setLineWidth} LineWidth={LineWidth} />
        </div>
        <canvas className={"cs"} style={{"float" : "left",cursor : "crosshair",marginLeft : "20px",marginTop : "10px",background : "linear-gradient(45deg, black, transparent)",backgroundColor : "aliceblue",border : "5px solid #232525"}} onKeyDown={e => handleKeyPress(e)}
        onMouseUp={() =>  {
          setDrawing(false)
          document.getElementById("canvas").getContext("2d").beginPath()
        }}
        
        onKeyDown={(e) => {
          e.preventDefault()
          handleKeyDown(e);
        }} 

        onKeyUp={(e) => {
          handleKeyUp(e)
        }}
    
        onMouseDown={(e) => {
          setDrawing(true)
        }} 

        onMouseMove={(e) => {
          window.getSelection().removeAllRanges()
          handleMove(e);
        }} 
        
        onMouseLeave={() => {
          if(drawing) setDrawingButMouseOutsie(true);
          setDrawing(false);
          document.getElementById("canvas").getContext("2d").beginPath()
        }}

        onMouseEnter={() => {
          if(drawingButMouseOutside && GMouse) setDrawing(true);
        }}
        
        width={800} height={600} id="canvas"></canvas>

        <div style={{"float" : "right",resize : "none",
        marginRight : "50px",marginTop : "10px"}}>
          <div className={"css"} style={{height : "500px",width : "250px",
          backgroundColor : "transparent",overflow : "auto",overflowX: "hidden"}}>
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
                let trgt = e.currentTarget
                if(trgt.value.trim().length < 1) return;
                e.preventDefault();
                socket.current.send(JSON.stringify({"type" : 1,'value' : e.target.value}))
                trgt.value = '';
              }}} 
                style={{"resize" : "none","maxHeight" : "50px",        
                background : "radial-gradient(#07071e, transparent)",
                backgroundColor : "#2e343a",
                border : "1px solid #333b52"}} as="textarea" rows="3" />
          </Form.Group>
        </div>
      </Container>
    </div>
  );
};