import React,{useRef,useEffect,useState} from 'react';
import * as math from 'mathjs';
import Vertices,{Triangle} from "./coordinates";

const Test3D = () => {
    const c3d = useRef();
    const [ctx,setCtx] = useState();
    const [width, height] = [800,600]
    const [fac,setFac] = useState(40);
    const [angleZ,setAngleZ] = useState(20);
    const [angleX,setAngleX] = useState(0);
    const [angleY,setAngleY] = useState(0);
    // const [mesh,setMesh] = useState([[[0,0,0],[0,0,2],[0,2,2],[2,2,2]],[[2,2,0],[0,2,0],[0,0,0],[2,0,0]],[[2,0,2],[0,0,2],[0,2,2],[0,2,0]],[[2,2,0],[2,0,0],[2,0,2],[2,2,2]]]);
    const [mesh,setMesh] = useState(Triangle)
    const [scaleFactor,setScaleFactor] = useState(1);
    let [real_ange,setRealAnge] = useState(0);
    const [mouse,setMouse] = useState(false);
    const [mc,setMc] = useState([0,0])
    
    // Matrix that projects 3D Vectors to 2D
    const ProjectionMatrix = math.matrix([
        [1,0,0],
        [0,1,0]
    ]);

    // 2D Rotation Matrices
    const RotationMatrixZ = (theta) => {
        const new_theta = theta * (Math.PI / 180) // Convert to degrees
        return math.matrix([
            [Math.cos(new_theta),-Math.sin(new_theta),0],
            [Math.sin(new_theta),Math.cos(new_theta),0],
            [0,0,1]
        ])
    }

    const RotationMatrixX = (theta) => {
        const new_theta = theta * (Math.PI / 180) // Convert to degrees
        return math.matrix([
            [1,0,0],
            [0,Math.cos(new_theta),-Math.sin(new_theta)],
            [0,Math.sin(new_theta),Math.cos(new_theta)]
        ])
    }

    const RotationMatrixY = (theta) => {
        const new_theta = theta * (Math.PI / 180) // Convert to degrees
        return math.matrix([
            [Math.cos(new_theta),0,Math.sin(new_theta)],
            [0,1,0],
            [-Math.sin(new_theta),0,Math.cos(new_theta)]
        ])
    }

    const clear = () => {
        ctx.clearRect(0, 0, width, height)
    }

    // Rotation due to changes in angle


    // useEffect(() => {
    //     if(!ctx) return;
    //     clear();
    //     let rotated_mesh = Rotate(angleZ,mesh,'z');
    //     setMesh(rotated_mesh);
    //     rotated_mesh.forEach(point => {
    //         ConnectPoints(point)
    //     })
    // },[angleZ])

    // useEffect(() => {
    //     if(!ctx) return;
    //     clear()
    //     let rotated_matrix = Rotate(angleX,mesh,'x');
    //     setMesh(rotated_matrix);
    //     rotated_matrix.forEach(point => {
    //         ConnectPoints(point)
    //     })
    // },[angleX])

    // useEffect(() => {
    //     if(!ctx) return;
    //     clear();
    //     let rotated_matrix = Rotate(angleY,mesh,'y');
    //     setMesh(rotated_matrix);
    //     rotated_matrix.forEach(point => {
    //         ConnectPoints(point)
    //     })
    // },[angleY])    

    // useEffect(() => {
    //     let cases = ['x','y','z'];

    //     let interval = setTimeout(() => {
    //         // let choice = cases[Math.round(Math.random() * 2)]
    //         setMesh(Rotate(real_ange,mesh,'y'))
    //         setRealAnge(prev => prev+0.01)
    //     },20)

    //     return () => {clearTimeout(interval)}
    // })

    // Re-render when something changes
    useEffect(() => {
        if(!ctx) return;
        clear()
        console.log(mesh)
        mesh.forEach(point => {
            ConnectPoints(point)
        })
    },[mesh])


    // Project 3D Cordinates to 2D
    const Project2D = (x,y,z,returnMatrix=false) => {
        let res = math.matrix([[x],[y],[z]]);
        let mul = math.multiply(ProjectionMatrix,res);
        if(returnMatrix) return mul;
        mul = mul._data
        return [mul[0][0],mul[1][0]];
    }

    const ProjectMatrix2D = (matrix) => {
        let arr,tmp_arr;
        arr = [];
        tmp_arr = [];
        matrix.forEach(vertex => {
            tmp_arr = [];
            vertex.forEach(coordinate => {
                tmp_arr.push(
                    Project2D(...coordinate)
                )
            })
            arr.push(tmp_arr);
        });
        return arr;
    };

    // Rotate 3D Cordinates (Vertices)
    const Rotate = (theta,matrix,axis) => {
        let rot_axis;
        switch(axis.toLowerCase()) {
            case 'y':
                rot_axis = RotationMatrixY;
                break;
            case 'x':
                rot_axis = RotationMatrixX;
                break;
            case 'z':
                rot_axis = RotationMatrixZ;
                break;
            default:
                return NaN;
        }
        let r_matrix = [];
        let tmp_matrix = [];
        let m_side;
        matrix.forEach(m => {
            tmp_matrix = [];
            m.forEach(point => {
                m_side = math.multiply(
                    rot_axis(theta),
                    point // Project2D(...point,true)
                )._data;
                tmp_matrix.push(m_side);  
            })
            r_matrix.push(tmp_matrix);
        })
        return r_matrix

    }

    const Scale = (factor,matrix) => {
        return math.multiply(factor,math.matrix(matrix))._data;
    }

    const cords = (e) => {
        let s = e.currentTarget.getBoundingClientRect();
        return [e.clientX-s.left, e.clientY-s.top] 
    }

    useEffect(() => {
        let ctx = c3d.current.getContext('2d');
        ctx.lineCap = "round";
        setCtx(ctx);
    },[])


    // Convert Pixel Width-Height to custom cartesian coordinates
    const mapCords = (x,y) => {
        return [(width/2)+(x*fac),(height/2)+(-y*fac)]
    }

    // Cartesian to Pixel
    const unMapCords = (x,y) => {
        return [
            ( x - (width/2) ) / fac,( y - (height/2) ) / fac
        ]
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      

    const ConnectPoints = (Square) => {
        let move,line;
        move = mapCords(...Square[0])
        let j =0;
        Square.forEach(i => {
            console.log(j)
            ctx.beginPath()
            ctx.strokeStyle = "orange"
            line = mapCords(...i);
            ctx.moveTo(...move);
            ctx.lineTo(...line);
            ctx.stroke();
            // ctx.strokeStyle = "blue"
            ctx.arc(...line,5,0,360,10)
            ctx.stroke();
            // ctx.fillRect(...line,10,10)
            move = line;
            j++;
        })

    }

    const PlotFunction = (f) => {
        let vals = [];
        for(let x=0;x<=50;x++) {
            for(let y=0;y<=50;y++) {
                vals.push(Project2D(...[x/10,y/10,f(x/10,y/10)]))
            }
        }
        return vals
    }

    // [x,y]
    // [1,0] 
    // [1,1]
    // [0,1]
    // [0,0]
    return (
        <div>
            <br></br>
            <label>Rotate <b>Z</b></label>
            <input style={{"marginLeft" : "20px"}} onChange={(e) => {
                setAngleZ(e.target.value*0.0174532925)
                setMesh(Rotate(e.target.value*0.0174532925,mesh,'z'))
            }} min={0} max={360} type="range"></input>
            <br></br>
            <label>Roate <b>X</b></label>
            <input style={{"marginLeft" : "20px"}} onChange={(e) => {
                setAngleX(e.target.value*0.0174532925);
                setMesh(Rotate(e.target.value*0.0174532925,mesh,'x'))
            }} min={0} max={360} type="range"></input>
            <br></br>
            <label>Roate <b>Y</b></label>
            <input style={{"marginLeft" : "20px"}} onChange={(e) => {
                setAngleY(e.target.value*0.0174532925 );
                setMesh(Rotate(e.target.value*0.0174532925 ,mesh,'y'))
            }} min={0} max={360} type="range"></input>
            <br></br>
            <label><b>Scale</b></label>
            <input style={{"marginLeft" : "20px"}} onChange={(e) => {
                setScaleFactor(e.target.value);
                setMesh(Scale(e.target.value,mesh));
            }} min={1} max={10} type="range"></input>

            <label>Roate <b>Forward</b></label>
            <input value={-mc} style={{"marginLeft" : "20px"}} onChange={(e) => {
                setAngleY(e.target.value*0.0174532925 );
                setMesh(Rotate(e.target.value*0.0174532925 ,mesh,'y'))
            }} min={0} max={360} type="range"></input>
            <br></br>
            <label>Roate <b>Backwards</b></label>
            <input value={mc} style={{"marginLeft" : "20px"}} onChange={(e) => {
                setMc(e.target.value*0.0174532925);
                setMesh(Rotate(e.target.value*0.0174532925 ,mesh,'y'))
            }} min={0} max={360} type="range"></input>
            <br></br>


            <canvas style={{"background" : "rgba(0,0,0,0.5)"}} ref={c3d}
            height={height} width={width}


            // onMouseDown={() => {
            //     setMouse(true)
            // }}

            // onMouseMove={(e) => {
            //     if(!mouse) return;
                // let s = e.currentTarget.getBoundingClientRect()
                // let [x,y] = [e.clientX-s.left,e.clientY-s.top];
            //     console.log(x,y)

            //     switch(true) {
            //         case y > mc[1]:
            //             setMesh(prev => Rotate(y*0.0174532925,prev,'y'))
            //             break;
            //     }

            //     setMc([x,y])

            // }}



            // onMouseUp={() => {
            //     setMouse(false);
            // }}
            
            >
            </canvas>
            <input id="peos"></input>
            <button onClick={() => {
                setMesh(Rotate(Number(document.getElementById("peos").value),mesh,'y'))
            }}>Rotate</button>
        </div>
    )
};

export default Test3D;