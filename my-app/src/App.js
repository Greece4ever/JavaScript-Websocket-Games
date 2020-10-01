// import React from 'react';
// import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
import React,{useEffect,useState} from "react"
import tmp from './tmp.json';

// https://www.pornhub.com/view_video.php?viewkey=ph5f06e9657a805#1


function App() {
  const [drawing,setDrawing] = useState(false);
  const [diff,setDiff] = useState(10)
  const [paths,setPaths] = useState([])

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    canvas.setAttribute("tabindex", 0);
    let ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = diff;
    // ctx.moveTo(e.clientX-diff,e.clientY-diff);

    tmp.forEach(cords => {
      ctx.lineTo(...cords)
      ctx.stroke();
      ctx.beginPath();  
    })
  })

  const handleMove = (e) => { 
    const canvas = document.getElementById("canvas");
    if(!drawing) return null;
    let ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = diff;
    let [x,y] = [e.clientX,e.clientY]
    // ctx.moveTo(e.clientX-diff,e.clientY-diff);
    ctx.lineTo(x,y);
    setPaths(prev => [...prev,[x,y]])
    ctx.stroke();
    ctx.beginPath();
    // console.log(paths)
  }

  const handleKeyPress = (e) => {
    if(e.keyCode===65){
      setDiff(prev => prev +1)
    }
    else if(e.keyCode==68){
      setDiff(prev=>prev-1)
    }
  }

  return (
    <div>
      <canvas onKeyDown={e => handleKeyPress(e)} onMouseUp={() =>  setDrawing(false)} onMouseDown={() => setDrawing(true)} onMouseMove={(e) => {handleMove(e)}} width={800} height={800} id="canvas"></canvas>
      <button onClick={() => console.log(paths)}>printf</button>
    </div>
  );
}

export default App;
