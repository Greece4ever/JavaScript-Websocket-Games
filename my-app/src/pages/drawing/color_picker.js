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

const ColorPicker = (props) => {
    const [gradient,setGradient] = useState([228, 204, 204]);
    const [xy,setXY] = useState([27, 27]);
    const [mouseDown,setMouseDown] = useState(false);
    const [mouseDownButOutside,setMouseDownButOutside] = useState(false);
    const [sliderXY,setSliderXY] = useState([30,300]);
    const [sliderDownButOutside,setSliderDownButOutside] = useState(false);
    const [sliderMouseDown,setSliderMouseDown] = useState(false);
    const [cursor,setCursor] = useState("auto");
    const cvs = useRef();
    const img1 = useRef();
    const cvs2 = useRef();
    const p_bar = useRef();
    const slider = useRef();

    const DrawCanvas = (color) => {
        let canvas = cvs.current;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = s
        img.onload = () => {
            ctx.drawImage(img,1,1)
        }
        ctx.fillStyle = color
        ctx.fillRect(1,1,canvas.width,canvas.height);
    }

    // Draw Initial Canvas
    useEffect(() => {
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

    // Create Color Slider
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
        props.setParentColor(colors);
      }

    const ChangeColorHue = (e) => {
        e.preventDefault();
        let canvas = e.currentTarget;
        let pos = findPos(canvas);
        let [x,y] = [e.pageX - pos.x,e.pageY - pos.y];
        let ctx = canvas.getContext('2d');
        let p = ctx.getImageData(x,y,1,1).data;
        DrawCanvas(`rgb(${p[0]},${p[1]},${p[2]})`);
    }
    
      const rgb = (r,g,b) => {
        return `rgb(${r},${g},${b})`
      }
 
      return(
          <div style={{"cursor" : cursor}}>
            <img style={{"visibility" : "hidden",position : "absolute"}} ref={img1} src={s}></img>
            <canvas style={{"border" : "11px solid transparent","background" : "radial-gradient(black, transparent)",borderRadius : "40px"}} ref={cvs} 
            onMouseDown={(e) => {
                e.preventDefault();
                setCursor("pointer");
                setMouseDown(true);
            }}
            onMouseUp={(e) => {
                e.preventDefault();
                setCursor("auto");
                setMouseDown(false);
            }}
            onMouseMove={(e) => {
                e.preventDefault();
                if(mouseDown) {
                    let s = e.currentTarget.getBoundingClientRect();
                    let [x,y] = [e.clientX,e.clientY];
                    let [dx,dy] = [s.left,s.top];
                    ChangeColor(e);
                    let x_pos = x-dx;
                    let y_pos = y-dy;
                    if(x_pos <= 20 || x_pos >= 260 || y_pos >= 255 || y_pos <= 15) return;
                    setXY(prev => [x-dx,y-dy]);    
                }
                return;}} 

            onMouseLeave={(e) => {
                e.preventDefault();
                setCursor("auto");
                if(mouseDown) setMouseDownButOutside(true);
                setMouseDown(false);
            }}

            onMouseEnter={() => {
                if(mouseDownButOutside && props.GMouse) {
                    setCursor("pointer");
                    setMouseDown(true);    
                }
            }}

            id={"myCanvas"} width={"256px"} height={"256px"}></canvas>
           
            <canvas style={{"borderRadius" : "50px",background : "radial-gradient(black, transparent)"}} ref={cvs2} width={"270px"} height={"50px"}
             onMouseDown={(e) => {
                e.preventDefault()
                setCursor("grab");
                e.preventDefault()
                setSliderMouseDown(true);
            }}
            
            onMouseUp={(e) => {
                e.preventDefault()
                setCursor("auto");
                setSliderMouseDown(false);
            }}

            onMouseLeave={(e) => {
                console.log("Mouse has left the area")
                e.preventDefault()
                setCursor("auto");
                console.log(`Is my mouse down ? : ${sliderMouseDown}`)
                if(sliderMouseDown) setSliderDownButOutside(true);
                setSliderMouseDown(false);
            }}

            onMouseEnter={() => {
                console.log(`Is my mouse down ? : ${sliderDownButOutside} and is Gmouses on ? : ${props.GMouse}`)
                if(sliderDownButOutside && props.GMouse) {
                    setCursor("pointer");
                    setSliderMouseDown(true);    
                }
            }}

            onMouseMove={(e) => {
                e.preventDefault();
                if(sliderMouseDown) {
                    let s = e.currentTarget.getBoundingClientRect();
                    let x = e.clientX;
                    let dx = s.left;
                    let x_pos = x - dx;
                    if(x_pos <= 27 || x_pos >= 256) {
                        return;
                    };
                    ChangeColorHue(e)
                    setSliderXY(prev => [x-dx,300]);    
                }
            }}
            
            >
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
                    <input value={props.lineWidth} onChange={(e) => props.setLineWidth(e.target.value)} className={"slider"} style={{"width" : "270px",marginTop : "15px"}} type="range"></input>
                </div>
                <div style={{"textAlign": "center"}}>
                    <kbd>Opacity</kbd>
                    <input  onChange={(e) => {props.setOpacity(e.target.value / 100)}} 
                    className={"slider"} style={{"width" : "270px",marginTop : "15px"}} 
                    type="range" start={0} end={100}></input>
                </div>
            </div>
            <div ref={p_bar} 
            style={{"width" : "20px",height : "20px",backgroundColor : "transparent",userSelect : "none",pointerEvents : "none",
            borderRadius : "50px",position : "absolute",border : "3px solid white",
            left : `${xy[0]}px`,top : `${xy[1]}px`,}}></div>
            <div style={{"width" : "10px",height : "40px",backgroundColor : "black",
            userSelect : "none",pointerEvents : "none",
            position : "absolute",left : `${sliderXY[0]}px`,top : `${sliderXY[1]}px`}} ref={slider}>
            </div>
            
        </div>)
    
       
}

export default ColorPicker;