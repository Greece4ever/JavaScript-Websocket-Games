import React,{useState,useEffect,useRef} from 'react';
import s from "./gradient.png";

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

const ColorPicker = () => {
    const [gradient,setGradient] = useState([]);
    const cvs = useRef();
    const img1 = useRef();
    const [config,setConfig] = useState([
        0,
        300,
        200,
        0
    ])


    useEffect(() => {
        // let canvas = ReactDOM.findDOMNode(cvs);
        let canvas = cvs.current;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.onload = () => {
            ctx.drawImage(img,1,1)
        }
        img.src = s

        // ctx.drawImage(g, canvas.width,canvas.height);


        // Create gradient
        // let grd = ctx.createLinearGradient(0,360,350,0);
        // grd.addColorStop(0,"white");
        // grd.addColorStop(1,"black");
        // grd.addColorStop(0.5,"red")
        // // grd.addColorStop(0,"white");

        // // Fill with gradient
        // ctx.fillStyle = grd;
        // ctx.fillRect(10,10,canvas.width,canvas.height);
    },[])

    const ChangeColor = (e) => {
        let pos = findPos(e.currentTarget)
        let [x,y] = [e.pageX - pos.x,e.pageY - pos.y];
        let ctx = e.currentTarget.getContext('2d');
        console.log(x,y)
        let p = ctx.getImageData(x,y,1,1).data;
        setGradient([p[0],p[1],p[2]])
        console.log()
      
      }
      return(
          <div>
            <img style={{"visibility" : "hidden"}} ref={img1} src={s}></img>
            <canvas ref={cvs} onMouseMove={(e) => ChangeColor(e)} id={"myCanvas"} width={"256px"} height={"256px"}></canvas>
            <div style={{"width" : "50px",height : "50px",backgroundColor : `rgb(${gradient[0]},${gradient[1]},${gradient[2]})`,position : "absolute"}} draggable
            onDrag={(e) => {
            let elm = e.currentTarget;
            elm.style.left = `${e.clientX-80}px`
            elm.style.top = `${e.clientY-100}px`
            }}
            onDrop={(e) => {
            let elm = e.currentTarget;
            elm.style.left = `${e.clientX}px`
            elm.style.top = `${e.clientY}px`
            }}
            ></div>
        </div>

        
      )
    
       
}

export default ColorPicker;