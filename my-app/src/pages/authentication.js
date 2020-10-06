import axios from 'axios';
import React,{useEffect} from 'react';
import {useHistory} from 'react-router-dom';

const fetchAuthenticaiton = (token) => {
    return axios.get("http://localhost:8000/users/identify",{
        headers : {
            'key' : token
        }
    })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();}


export default function useAuthentication(){
    const history = useHistory();
    const deny = () => {history.push("/");return;}

    useEffect(() => {        
        let SESSION_ID = getCookie("DARIUSESSIONID");
        if(SESSION_ID==undefined) deny();
        async function isAuthenticated(token){
            console.log("FETCHING DATA")
            const response = await fetchAuthenticaiton(token);
            if(response.data.error) deny();
            console.log(response)}        
        try {let authenticated = isAuthenticated(SESSION_ID);}
        catch {deny();}
      },[])
    
}