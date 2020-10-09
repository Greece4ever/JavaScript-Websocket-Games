import React,{useState,useEffect} from 'react';
import {Form,Button,Container,ProgressBar,Spinner,Alert} from "react-bootstrap"
import axios from "axios";

var domain = (protocol,port) => {
    return `${protocol}://localhost:${port}`;
} 

const handleAscii = (str) => {
    return str.replace(" ",'_')
}

const CreateUser = (name,password,avatar) => {
    let formData = new FormData();
    formData.append("username", name);formData.append("password", password);formData.append("avatar",avatar);
    return axios.post(domain("http",8000) + "/users/create",formData,{
        headers : {
            'Content-Type': 'multipart/form-data'
        }
    })
}

const checkUsername = (name) => {
    console.log(encodeURI(name))
    return axios.get(domain("http",8000) + "/users/create",{
        headers : {
            "username" : encodeURI(name),
        }
    })
}

const isGoodPassword = (password) => {
    let points = 0;
    let w_reg = /[a-zA-Z]+/;
    if(password.length > 8) points+=1; // More than 8 charachters
    if((/\d+/).test(password) && (w_reg).test(password)) points +=1; // Characters and numbers
    if((/^[A-Z \d\W]+/).test(password) && (/\w+/).test(password)) points +=1; // Both Lower and Upper case
    if((/\W+/).test(password)) points +=1;
    return points;
}

const Queue = () => {
    useEffect(() => {document.body.style.backgroundColor = "#333b52"});
    const [name,setName] = useState("");
    const [ready,setReady] = useState(false);
    const [error,setError] = useState(false);
    const [move,setMove] = useState(false);
    const [opacity,setOpacity] = useState(1);
    const [img,setImg] = useState();
    const [pass,setPass] = useState("");
    const [spinner,setSpiner] = useState('');
    const [passtat,setPasstat] = useState(['danger','Very Low',25])
    const [win,setWin] = useState(false);

    let ok = <svg style={{"color" : "#44d6af",marginLeft : "10px"}} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bookmark-check-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 0a2 2 0 0 0-2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4zm6.854 5.854a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/></svg>;
    let spin = <Spinner style={{"width" : "1em",height:"1em",marginLeft : "10px"}} animation="border" />

    const handleSubmit = async () => {
        try{
            setError('');
            const response = await CreateUser(name,pass,img);
            if(!response.data.error){
                document.cookie = `DARIUSESSIONID=${response.data.token}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;`;
                setWin(response.data.username);
            }
        }
        catch(e) {
            let msg = "File too Large, must be below 2MB.";
            if(e.response) msg = e.response.data.error;
            setWin(false);
            setError(msg);
        }
    }

    useEffect(() => {
        if(!move) {setMove(true);return () => {}} // Do not send ajax on first render
        setSpiner(spin);
        const timeout = setTimeout(() => {
            checkUsername(name).then(response => {
                let err = response.data.error;
                setSpiner('');
                if(err){
                    setError(err);
                    return () => {}
                } else {
                    setSpiner(ok)
                }
            })
        },1500)
        return() => {clearTimeout(timeout)}
    },[name])

    let stats = {
        0 : ['danger','Very Low',25],
        1 : ['danger','Low',35],
        2 : ['warning','Medium',50],
        3 : ['info','OK',75],
        4 : ['success','Strong',100],
    }

    useEffect(() => {
        let points = isGoodPassword(pass);
        setPasstat(prev => stats[points])
    },[pass])

    return (
        <Container style={{"maxWidth" : "470px",marginTop : "20px"}}>
            {!error ? '' : <Alert variant={"danger"} style={{"backgroundColor" : "rgb(69, 44, 47)",border : 0,color : "rgb(255, 181, 187)",marginTop : "10px"}}>{error}</Alert>}
            {!win ? '' :  <Alert variant={"success"} style={{marginTop : "10px"}}>Sucessfuly created account for {win}.</Alert>}
            <Form onSubmit={(e) => {e.preventDefault();handleSubmit(e)}}>
            <Form.Group>
                <Form.Label style={{"color" : "#eaeaea"}}>Enter your Username. <span>{spinner}</span></Form.Label>
                <Form.Control id={`usr`} value={name} maxLength={16} onChange={(e) => {setName(handleAscii(e.target.value));}} type="text" placeholder="" disabled={ready}/>
                <Form.Text className="text-muted">
                The username that will be used.
               </Form.Text>
               <Form.Label style={{"color" : "#eaeaea"}}>Enter your password.</Form.Label>
                <Form.Control id={`getpass`} value={pass} maxLength={50} onChange={(e) => {setPass(e.target.value);}} type="password" placeholder="" disabled={ready}/>
                <ProgressBar style={{"marginTop" : "15px",backgroundColor : "rgba(82, 82, 82,0.5)"}}>
                    
                    <ProgressBar animated  striped variant={passtat[0]} label={passtat[1]} now={passtat[2]} key={3} />
                </ProgressBar>

               <div 
               onDragOver={(e) => {
                   e.preventDefault();
                   setOpacity(0.5);
               }} 
               onDrop={(e) => {
                   e.preventDefault();
                   setOpacity(1);
                   let file = e.dataTransfer.files[0];
                   console.log(file.name);
                   setImg(e.dataTransfer.files[0]);
               }}
               style={{"width" : "100%",height : "200px",backgroundColor : "rgb(116 130 169)",border : "2px solid #323839",borderStyle : "dotted",marginTop : "20px"}}>
                <div onClick={() => document.getElementById("file").click()} style={{"textAlign": "center",marginTop : "50px",marginRight : "1px",opacity : opacity,cursor : "pointer"}}>
                    <svg style={{"pointerEvents" : "none",userSelect : "none",color : "#333b52"}} width="50px" height="50px" viewBox="0 0 16 16" className="bi bi-cloud-upload-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z"/>
                    </svg>
                    <br></br>
                    <b style={{"fontFamily" : "sans-serif",pointerEvents : "none",userSelect : "none"}}>Drop Your Avatar Image Here</b><br></br>
                    {img ? <span style={{"pointerEvents" : "none",userSelect : "none"}}><b>1</b> File dropped</span> : ""}
                </div>

               </div>
               <Form.Control onChange={(e) => {
                setImg(e.target.files[0]);
               }} id={"file"} style={{"visibility" : "hidden"}} type={"file"}></Form.Control>
            </Form.Group>
            <div>
                <Button style={{width : "100%"}} variant="primary" type="submit" disabled={pass.length > 0 && name.length > 0 && img!==undefined  ? false : true}>
                    Continue
                </Button>
            </div>
            </Form>
        </Container>
    )
}

export default Queue;