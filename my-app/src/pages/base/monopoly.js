import React,{useEffect,useState} from 'react';
import MPCard,{BigCard} from "./card";
import places from "./places.monopoly.json";
import {Row} from "react-bootstrap";
import jail from "./jail.jpg"

const Monopoly = () => {
    const [cards,setCards] = useState([[],[],[],[]]);
    const [moving,setMoving] = useState(false);

    // useEffect(() => {
    //     document.addEventListener("mousedown",() => {
    //         console.log("mouse down")
    //         setMoving(true);
    //     })

    //     document.addEventListener("mouseup",() => {
    //         console.log("mouse up")
    //         setMoving(false);
    //     })

    //     document.addEventListener("mousemove",() => {
    //         if(moving){
    //             console.log("Player is moving")
    //         }
    //     })

    //     return () => {
    //         document.removeEventListener("mousemove",()=>{});
    //         document.removeEventListener("mouseup",()=>{});
    //         document.removeEventListener("mousedown",()=>{});
    //     }

    // })

    // Add Elements with information
    useEffect(() => {
        let rows = [[],[],[],[]]; 
        let j = 0;
        for(let i=1;i <= places.length;i++){
            rows[j].push(places[i])
            if(i%10===0 && j!==3){
                j+=1
            }
        }
        rows[0].pop(rows[0].length)
        setCards(rows);
        console.log(rows)
    },[])


    return(
        <div style={{position : "relative", "minWidth": "100vh",minHeight : "100vh"}}>
            <Row>
                {cards[0].map(card => (
                    <div>
                        {card===undefined ? '' : <MPCard price={card.cost} text={card.name} color={card.color}></MPCard>}
                    </div>
                ))}
                <BigCard img={jail}></BigCard>
            </Row>
            <Row style={{position : "absolute",transformOrigin : "300px 300px",transform: "rotate(90deg)","right" : "0"}}>
                {cards[1].map(card => (
                    <div>
                        {card===undefined ? '' : <MPCard price={card.cost} text={card.name} color={card.color}></MPCard>}
                    </div>
                ))}
            </Row>
            <Row style={{position : "absolute",transformOrigin : "300px 300px",transform: "rotate(180deg)","bottom" : 0w}}>
                {cards[3].map(card => (
                    <div>
                        {card===undefined ? '' : <MPCard price={card.cost} text={card.name} color={card.color}></MPCard>}
                    </div>
                ))}
            </Row>

        </div>
    )
}


export default Monopoly