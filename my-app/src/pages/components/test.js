import React,{useRef,useState,useEffect} from 'react';
import katex from "katex";
// import {Form} from 'react-bootstrap';

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}


const Test = () => {
    const canvas = useRef();
    const l = useRef();
    const m = useRef();
    const mathex = useRef();
    const [move,setMove] = useState([400,300])
    const [fac,setFac] = useState(40);
    const [down,setDown] = useState(false);
    const [r,setR] = useState(0); // Sideways movement
    const [u,setU] = useState(0); // Up and down
    const [MouXY,setMouXY] = useState([0,0]);
    const [func,setFunc] = useState(false);
    let [text,setText] = useState('')

    // Convert canvas cords into X,Y graphable coordinates
    const mapCords = (x,y) => {
        return [400+(x*fac),300+(-y*fac)]
    }
    
    // Connect each (x,y) coordinate with a line
    const plot = (x,y) => {
        const cvs = canvas.current
        let ctx = cvs.getContext('2d');
        let [c,d] = mapCords(x[0],y[1]);
        ctx.moveTo(c-0.1,d-0.1)
        for(let i=0;i<x.length;++i){
            let [x1,y1] = mapCords(x[i],y[i]);
            ctx.lineTo(x1,y1);
            ctx.stroke();
            ctx.moveTo(x1,y1)
        }
    }

    useEffect(() => {
        clear();
        const cvs = canvas.current
        let ctx = cvs.getContext('2d');
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.moveTo(0,300-u); // w h
        ctx.lineTo(800+r,300-u); 
        ctx.moveTo(400+r,300+r);
        ctx.lineTo(400+r,0-u)
        ctx.moveTo(400+r,300+r);
        ctx.lineTo(400+r,600);
        ctx.stroke()
        // ctx.lineTo(400,0);
    },[fac,r,u])

    // Clear everything on the canvas
    const clear = () => {
        let ctx = canvas.current.getContext('2d');
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }

    useEffect(() => {
        katex.render(text,mathex.current,{throwOnError: false})
        setEndOfContenteditable(mathex.current)
        try {
            let eq_lambda = parseEquation(text)
            clear()
            setFunc(prev => eq_lambda);
            setR(prev => prev-0.01)
        }
        catch {return;}
        // console.log(parseEquation(text))
    },[text])

    // Left Cords
    useEffect(() => {
        const cvs = canvas.current
        console.log("CHABGUIB")
        console.log(func)
        let ctx = cvs.getContext('2d');
        if(func){
            graph(func)
        }
        let cur = 400;
        ctx.font  = "10px Arial"
        ctx.moveTo(400,300);
        let j =1;
        let factor = fac;
        ctx.fillStyle = "white"
        for(let i=0;i < 10;i++) {
            ctx.beginPath();
            ctx.moveTo(cur + factor,300); 
            ctx.strokeStyle = "rgba(48,73,152,0.3)";
            ctx.lineTo(cur + factor,0-u); // <---- 280 (grid)
            ctx.lineTo(cur + factor,600); // <---- 280
            ctx.fillStyle = "white"
            ctx.fillText(String(j),cur + factor+r,320-u) // <--- r is going left or right
            ctx.stroke();
            j+=1;
            cur += factor;
        }
    },[fac,r,u])

    // Right Cords
    useEffect(() => {
        const cvs = canvas.current
        let ctx = cvs.getContext('2d');
        let cur = 400;
        ctx.font  = "10px Arial"
        ctx.moveTo(cur,300);
        let j =1;
        let factor = fac;
        for(let i=0;i < 10;i++) {
            ctx.beginPath();
            ctx.moveTo(cur - factor,300);
            ctx.lineTo(cur - factor,0); // 280 <-----
            ctx.lineTo(cur - factor,600); // <-----
            ctx.fillText("-" + String(j),cur - factor+r,320-u)
            ctx.stroke();
            j+=1;
            cur -= factor;
        }
    },[fac,r,u])

    // Up Cords
    useEffect(() => {
        const cvs = canvas.current
        let ctx = cvs.getContext('2d');
        let cur = 300;
        ctx.font  = "10px Arial"
        ctx.moveTo(cur,300);
        let j =1;
        let factor = fac;
        for(let i=0;i < 10;i++) {
            ctx.beginPath();
            ctx.moveTo(400,cur - factor); 
            ctx.lineTo(800,cur - factor); // <----- 420
            ctx.lineTo(0,cur - factor); // <----- 420
            ctx.fillText(String(j),380+r,cur - factor-u)
            ctx.stroke();
            j+=1;
            cur -= factor;
        }
    },[fac,r,u])
    
    // Down Cords
    useEffect(() => {
        const cvs = canvas.current
        let ctx = cvs.getContext('2d');
        let cur = 300;
        ctx.font  = "10px Arial"
        ctx.moveTo(cur,300);
        let j =1;
        let factor = fac;
        for(let i=0;i < 10;i++) {
            ctx.beginPath();
            ctx.moveTo(400,cur + factor);
            ctx.lineTo(800,cur + factor); // <----- 420
            ctx.lineTo(0,cur + factor); // <----- 420
            ctx.fillText("-" + String(j),380+r,cur + factor -u)
            ctx.stroke();
            j+=1;
            cur += factor;
        }
    },[fac,r,u])

    const graph = (f,start=-1000,end=1000) => {
        let ctx = canvas.current.getContext('2d');
        ctx.lineCap = "round";
        ctx.strokeStyle = "brown"
        let x = [];
        let y = [];
        let x1,y1;
        for(let i=start;i < end;i++) {
            x1 = i / 100;
            y1 = f(x1);
            if(isNaN(y1)) continue;
            x.push(x1);
            y.push(y1)
        }
        plot(x,y)
    }

    const handleClick = () => {
        const cvs = canvas.current
        let ctx = cvs.getContext('2d');
        let m_ = JSON.parse(m.current.value);
        let l_ = JSON.parse(l.current.value);
        console.log(mapCords(...m_))
        console.log(mapCords(...l_))
        console.log(l_)
        ctx.moveTo(...mapCords(...m_));
        ctx.lineTo(...mapCords(...l_));
        ctx.stroke()
        // => [width / 2,height /2]
    }

    const f = (x) => {
        return Math.tanh(Math.sin(x**2))
    }

    const parseEquation = (str) => {
        if(str.trim().length == 0) return;
        let sides = str.split("=");
        return eval(`x => ${sides[1].trim()}`)
    }

    return(
        <div style={{"textAlign": "center",marginTop : "20px"}}>
            <div>
            <div style={{backgroundColor : "#fff",width : "800px",height : "50px",
            
            background : "radial-gradient(black, transparent)",color : "rgb(184 184 195)",fontSize : "24px",
            width : "800px",
            position : "absolute",left : "50%",transform : "translateX(-50%)"}} ref={mathex} spellCheck={false} onKeyDown={(e) => {
                let char = e.key;
                if(char !=='Backspace') return;
                setText(prev => prev.slice(0,-1))
                katex.render(text,e.currentTarget,{throwOnError: false})
                setEndOfContenteditable(e.currentTarget)
            }}
            
            onKeyPress={(e) => {
                let char = e.key;
                if(char==='Enter') return;
                setText(prev => prev + char)
                // katex.render(text,e.currentTarget,{throwOnError: false})
                // setEndOfContenteditable(e.currentTarget)
            }}
            contentEditable>
            </div>

            <canvas tabIndex={0} ref={canvas} 
            // Zoom
            onWheel={(e) => {
                clear();
                if(e.deltaY > 0){
                    if(fac <= 7) return setFac(prev => prev + 1);
                    return setFac(prev => prev-1);    
                }
                return setFac(prev => prev+1)
            }}

            onMouseDown={() => {
                return setDown(true);
            }}

            onMouseUp={() => {
                return setDown(false);
            }}

            onMouseMove={(e) => {
                if(!down) return; 
                let [x,y] = [e.clientX, e.clientY];
                console.log(`${[x,y]} is ${MouXY}`)

                switch(true){
                    case x > MouXY[0]:
                        console.log('less')
                        setR(prev => prev + 1);
                        break;
                    case x < MouXY[0]:
                        setR(prev => prev - 1)
                        break
                }

                switch(true) {
                    case y < MouXY[1]:
                        setU(prev => prev + 1);
                        break
                    case y > MouXY[1]:
                        setU(prev => prev - 1);
                        break
                }

                return setMouXY([x,y])
            }}

            onKeyPress={(e) => {
                clear();    
                switch(e.key) {
                    case 'a':
                        return setR(prev => prev - 50);
                    case 'd':
                        return setR(prev => prev + 50);
                    case 'w':
                        return setU(prev => prev + 50);
                    case 's':
                        return setU(prev => prev -50);
                }
            }}

            style={{"backgroundColor" : "white",cursor : down ? "move" : 'auto',background : "radial-gradient(black, transparent)"}} width={800} height={600}></canvas>
            </div>
        </div>
    )
}

export default Test;