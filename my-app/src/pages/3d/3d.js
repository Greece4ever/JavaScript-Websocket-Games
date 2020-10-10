import React,{useRef,useEffect,useState} from 'react';
import * as math from 'mathjs';
import Vertices from "./coordinates";

const Test3D = () => {
    const c3d = useRef();
    const [ctx,setCtx] = useState();
    const [width, height] = [800,600]
    const [fac,setFac] = useState(40);
    const [angle,setAngle] = useState(20);
    const [angleX,setAngleX] = useState(0);
    const [angleY,setAngleY] = useState(0);
    // const [mesh,setMesh] = useState(Vertices);
    
    
    // Matrix that projects 3D Vectors to 2D
    const ProjectionMatrix = math.matrix([
        [1,0,0],
        [0,1,0]
    ]);

    // 2D Rotation (Z Axis)
    const RotationMatrixZ = (theta) => {
        const new_theta = theta * (Math.PI / 180) // Convert to degrees
        return math.matrix([
            [Math.cos(new_theta),-Math.sin(new_theta)],
            [Math.sin(new_theta),Math.cos(new_theta)]
        ])
    }

    const RotationMatrixX = (theta) => {
        const new_theta = theta * (Math.PI / 180) // Convert to degrees
        return math.matrix([
            [1,0,0],
            [0,Math.cos(theta),-Math.sin(theta)],
            [0,Math.sin(theta),Math.cos(theta)]
        ])
    }

    const RotationMatrixY = (theta) => {
        const new_theta = theta * (Math.PI / 180) // Convert to degrees
        return math.matrix([
            [Math.cos(theta),0,Math.sin(theta)],
            [0,1,0],
            [-Math.sin(theta),0,Math.cos(theta)]
        ])
    }

    const clear = () => {
        ctx.clearRect(0, 0, width, height)
    }

    useEffect(() => {
        if(!ctx) return;
        // console.log(angle)
        clear();
        let Inverted = RotateZ(angle,Vertices);
        ConnectPoints(Inverted[0]);
        ConnectPoints(Inverted[1]);
        ConnectPoints(Inverted[2]);
        ConnectPoints(Inverted[3]);
    },[angle])

    useEffect(() => {
        if(!ctx) return;
        clear()
        console.log(angleX);
        let rotated_matrix = RotateX(angleX,Vertices);
        rotated_matrix.forEach(point => {
            ConnectPoints(point)
        })
        console.log(rotated_matrix)
    },[angleX])

    useEffect(() => {
        if(!ctx) return;
        clear();
        let rotated_matrix = RotateY(angleY,Vertices);
        rotated_matrix.forEach(point => {
            ConnectPoints(point)
        })
        console.log(rotated_matrix)
    },[angleY])

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

    const RotateZ = (theta,matrix) => {
        let r_matrix = [];
        let tmp_matrix = [];
        let m_side;
        matrix.forEach(m => {
            tmp_matrix = [];
            m.forEach(point => {
                m_side = math.multiply(
                    RotationMatrixZ(theta),
                    Project2D(...point,true)
                )._data;
                m_side = [m_side[1][0],m_side[0][0]]
                tmp_matrix.push(m_side);  
            })
            r_matrix.push(tmp_matrix);
        })
        return r_matrix
    }

    const RotateX = (theta,matrix) => {
        let r_matrix = [];
        let tmp_matrix = [];
        let m_side;
        matrix.forEach(m => {
            tmp_matrix = [];
            m.forEach(point => {
                m_side = math.multiply(
                    RotationMatrixX(theta),
                    point
                )._data;
                tmp_matrix.push(m_side);  
            });
            r_matrix.push(tmp_matrix);
        });
        return r_matrix
    };

    const RotateY = (theta,matrix) => {
        let r_matrix = [];
        let tmp_matrix = [];
        let m_side;
        matrix.forEach(m => {
            tmp_matrix = [];
            m.forEach(point => {
                m_side = math.multiply(
                    RotationMatrixY(theta),
                    point
                )._data;
                tmp_matrix.push(m_side);  
            });
            r_matrix.push(tmp_matrix);
        });
        return r_matrix
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


    const mapCords = (x,y) => {
        return [(width/2)+(x*fac),(height/2)+(-y*fac)]
    }

    const ConnectPoints = (Square) => {
        ctx.strokeStyle = "black";
        let move,line;
        move = mapCords(...Square[0])
        Square.forEach(i => {
            ctx.beginPath()
            line = mapCords(...i);
            ctx.moveTo(...move);
            ctx.lineTo(...line);
            ctx.stroke();
            move = line;
       })
    }

    // Draw Coordinate system
    useEffect(() => {
        if(!ctx) return;
        ctx.strokeStyle = "black"
        ctx.beginPath()
        ctx.moveTo(0,300); // w h
        ctx.lineTo(800,300); 
        ctx.moveTo(400,300);
        ctx.lineTo(400,0)
        ctx.moveTo(400,300);
        ctx.lineTo(400,600);
        ctx.stroke()
        // ctx.lineTo(400,0);
    },[ctx])

    // [x,y]
    // [1,0] 
    // [1,1]
    // [0,1]
    // [0,0]
    return (
        <div>
            {/* Down Square */}

            <button onClick={() => {
                let Projected,VertProjected;
                Vertices.forEach(vertex => {
                    VertProjected = [];
                    vertex.forEach(point => {
                        Projected = Project2D(...point);
                        VertProjected.push(Projected);

                    })
                    ConnectPoints(VertProjected)
                })
            }}>
                Horizontal
            </button>

            <button onClick={() => {
                clear();
                let Inverted = RotateZ(angle,Vertices);
                ConnectPoints(Inverted[0]);
                ConnectPoints(Inverted[1]);
                ConnectPoints(Inverted[2]);
                ConnectPoints(Inverted[3]);
            }}>
                Rotate
            </button>

            <br></br>
            <label>Rotate <b>Z</b></label>
            <input style={{"marginLeft" : "20px"}} onChange={(e) => setAngle(e.target.value)} min={0} max={360} type="range"></input>
            <br></br>
            <label>Roate <b>X</b></label>
            <input style={{"marginLeft" : "20px"}} onChange={(e) => setAngleX(e.target.value/100)} min={0} max={360} type="range"></input>
            <br></br>
            <label>Roate <b>Y</b></label>
            <input style={{"marginLeft" : "20px"}} onChange={(e) => setAngleY(e.target.value/100)} min={0} max={360} type="range"></input>

            <canvas style={{"background" : "white"}} ref={c3d}
            height={height} width={width}
            onContextMenu={(e) => {
                e.preventDefault();
                let [x,y] = cords(e);
                ctx.moveTo(x,y);
            }}
            
            onClick={(e) => {
                let [x,y] = cords(e)
                ctx.lineTo(x,y);
                ctx.stroke();
            }}>
            </canvas>
        </div>
    )
};


export default Test3D;