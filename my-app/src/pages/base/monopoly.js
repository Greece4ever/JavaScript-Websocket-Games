import React,{useEffect,useState} from 'react';
import MPCard from "./card";
import places from "./places.monopoly.json";
import {Row} from "react-bootstrap"

const Monopoly = () => {
    const [cards,setCards] = useState([[],[],[],[]])
    
    useEffect(() => {
        let rows = [[],[],[],[]];
        let j = 0;
        for(let i=1;i <= places.length;i++){
            rows[j].push(places[i])
            if(i%10===0 && j!==3){
                j+=1
            }
        }
        setCards(rows);
        console.log(rows)
    },[])

    return(
        <div style={{zoom : "0.25"}}>
            {cards.map(arr => (
                <Row>
                    {arr==undefined ? '' : arr.map(card => (
                        <div>
                            {card===undefined ? '' : <MPCard price={card.cost} text={card.name} color={card.color}></MPCard>}
                        </div>
                        // <b>{JSON.stringify(card)}</b>
                    ))}           
                </Row>
            ))}
        </div>
    )
}


export default Monopoly