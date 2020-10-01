// import React from 'react';
// import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
import React,{useEffect,useState} from "react"
import tmp from './tmp.json';
import "./pages/base/base.css"
import {Form} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';


// https://www.pornhub.com/view_video.php?viewkey=ph5f06e9657a805#1


function App() {
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
  })


  useEffect(() => {
    const canvas = document.getElementById("canvas");
    canvas.setAttribute("tabindex", 0);
    // let ctx = canvas.getContext("2d");
    // ctx.lineCap = "round";
    // ctx.lineWidth = diff;
    // // ctx.moveTo(e.clientX-diff,e.clientY-diff);

    // tmp.forEach(cords => {
    //   ctx.lineTo(...cords)
    //   ctx.stroke();
    //   ctx.beginPath();  
    // })
    

  })

  // Draw on Screen
  const handleMove = (e) => { 
    const canvas = document.getElementById("canvas");
    if(!drawing) return null;
    let ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = LineWidth;
    ctx.strokeStyle  = color;
    let [x,y] = [e.clientX,e.clientY]
    // ctx.moveTo(e.clientX-diff,e.clientY-diff);
    ctx.lineTo(x,y);
    setPaths(prev => [...prev,[x,y]])
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x-caligraphy,y-caligraphy)
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

    // Clear
    else if (e.keyCode === 88 && keys){
      let ctx = document.getElementById("canvas").getContext("2d");
      ctx.clearRect(0,0,document.getElementById("canvas").width,document.getElementById("canvas").height);
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
    <div>
      <div>
        <span style={{"visibility" : "hidden"}}>hello world</span>
      </div>
      <canvas className={"cs"} style={{"float" : "left",cursor : "crosshair",marginLeft : "20px"}} onKeyDown={e => handleKeyPress(e)}
       onMouseUp={() =>  {setDrawing(false);document.getElementById("canvas").getContext("2d").beginPath()}}
       onKeyDown={(e) => handleKeyDown(e)} 
       onKeyUp={(e) => handleKeyUp(e)}
       onMouseDown={() => setDrawing(true)} 
       onMouseMove={(e) => {handleMove(e)}} width={800} height={500} id="canvas"></canvas>
      <div style={{"float" : "right",resize : "none",marginRight : "50px"}}>
        <div className={"css"} style={{height : "421px",width : "200px",backgroundColor : "transparent"}}>
        </div>
        <Form.Group style={{"marginTop" : "30px"}}  controlId="exampleForm.ControlTextarea1">
          <Form.Control style={{"resize" : "none","maxHeight" : "50px"}} as="textarea" rows="3" />
        </Form.Group>
      </div>
      <div>
        <input onChange={(e) => {setColor(e.target.value)}} id="pick" style={{"backgroundColor" : "transparent",border : "0",height : "0px",width : "0px",position : "fixed","visibility" : "hidden"}} type="color"></input>
      </div>
      {/* <button onClick={() => console.log(paths)}>printf</button> */}
    </div>
  );
}

export default App;
