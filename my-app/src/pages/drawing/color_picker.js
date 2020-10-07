import React,{useState,useEffect,useRef} from 'react';
import {Form,Row} from "react-bootstrap";
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
    const cvs2 = useRef();
    const p_bar = useRef()

    useEffect(() => {
        // let canvas = ReactDOM.findDOMNode(cvs);
        let canvas = cvs.current;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.onload = () => {
            ctx.drawImage(img,1,1)
        }
        img.src = s
        ctx.fillStyle = "red"
        ctx.fillRect(1,1,canvas.width,canvas.height);
    },[])

    useEffect(() => {
        const canvas = cvs2.current;
        var ctx = canvas.getContext("2d");
        
        // Create gradient
        var grd = ctx.createLinearGradient(0, 0, 300, 0);
        grd.addColorStop(0.15, "red");
        grd.addColorStop(0.25, "orange");
        grd.addColorStop(0.45, "yellow");
        grd.addColorStop(0.55, "green");
        grd.addColorStop(0.70, "blue");
        grd.addColorStop(0.85, "indigo");
        grd.addColorStop(1, "violet");
        grd.addColorStop(1, "red");
        grd.addColorStop(1, "orange");

        
        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(10, 10, canvas.width, canvas.height);
        
    },[])

    const ChangeColor = (e) => {
        let pos = findPos(e.currentTarget)
        let [x,y] = [e.pageX - pos.x,e.pageY - pos.y];
        let ctx = e.currentTarget.getContext('2d');
        let p = ctx.getImageData(x,y,1,1).data;
        let colors = [p[0],p[1],p[2]];
        setGradient(colors)
        console.log(colors)      
      }
    

      const rgb = (r,g,b) => {
        return `rgb(${r},${g},${b})`
      }
 

      return(
          <div>
            <img style={{"visibility" : "hidden",position : "absolute"}} ref={img1} src={s}></img>
            <canvas style={{"border" : "11px solid transparent","background" : "radial-gradient(black, transparent)",borderRadius : "40px"}} ref={cvs} onMouseMove={(e) => ChangeColor(e)} id={"myCanvas"} width={"256px"} height={"256px"}></canvas>
            <canvas style={{"borderRadius" : "50px",background : "radial-gradient(black, transparent)"}} ref={cvs2} width={"270px"} height={"50px"}>
            </canvas>
            <div>
                <Form.Group>
                    <Row style={{"marginTop" : "10px"}}>
                        <kbd style={{"width" : "20%",marginLeft :"20px",display : "-webkit-flex"}}>RED <div style={{"width" : "10px",height : "10px",backgroundColor : "red",marginLeft : "10px",marginTop : "5px"}}></div></kbd>
                        <kbd style={{"width" : "21%",marginLeft :"40px",display : "-webkit-flex"}}>GREEN <div style={{"width" : "10px",height : "10px",backgroundColor : "green",marginLeft : "5px",marginTop : "5px"}}></div></kbd>
                        <kbd style={{"width" : "20%",marginLeft :"40px",display : "-webkit-flex"}}>BLUE <div style={{"width" : "10px",height : "10px",backgroundColor : "blue",marginLeft : "10px",marginTop : "5px"}}></div></kbd>
                    </Row>
                    <Row style={{"marginTop" : "10px"}}>
                        <Form.Control value={gradient[0]} className={"css"} style={{"width" : "30%",marginLeft :"10px",background : "radial-gradient(black, transparent)",border : 0}} />
                        <Form.Control value={gradient[1]} className={"css"} style={{"width" : "30%",marginLeft :"5px",background : "radial-gradient(black, transparent)",border : 0}} />
                        <Form.Control value={gradient[2]} className={"css"} style={{"width" : "30%",marginLeft :"5px",background : "radial-gradient(black, transparent)",border : 0}} />
                    </Row>
                </Form.Group>
                <div style={{"textAlign": "center"}}>
                    <kbd>Line Width</kbd>
                    <input className={"slider"} style={{"width" : "270px",marginTop : "15px"}} type="range"></input>
                </div>
            </div>
            <div ref={p_bar} style={{"width" : "10px",height : "50px",backgroundColor : "white"}}></div>
            <div style={{"width" : "50px",height : "50px",backgroundColor : rgb(gradient[0],gradient[1],gradient[2])}} draggable
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