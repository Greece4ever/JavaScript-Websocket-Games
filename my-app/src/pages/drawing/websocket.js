export const SocketHandler = (message,kwargs) => {
    let data =  JSON.parse(message.data);
    const type = data.type;
    delete data.type;
    switch(type){
        case 0: // Connect
            kwargs.players[0](prev => [...prev,data])
            break;
        case 1: // Chat 
            kwargs.setMSG(prev => [...prev,data])
            break;
        case 2:
            break;
        case 3:
            console.log("DISCONNECT")
            let players = kwargs.players
            console.log(players)
            players[1].forEach(player => {
                console.log([player.id,data.id])
                if(player.id===data.id) {
                    let index = players[1].indexOf(player);
                    return players[0](() => player[1].slice(index,1))
                }})
            break;
        case 4:
            
    }


    //     if(typeof(data)==='string') data = JSON.parse(data);

//     if(data.type===2) {
//       let d = data.value;
//       drawData(d[0],d[1],d[2],d[3]);
//       return;
//     }

//     // Handle New Connection
//     if(data.type === 0) {
//       if(typeof(data)==Array) {
//         data.forEach(item => {
//           setPlayers(prev => [...prev,{
//             "username" : item.username,
//             "img" : item.img,
//             "score" : item.score,
//             "color" : `rgba(${color[0]},${color[1]},${color[2]},0.4)`}
//   ])
//         })
//       }

//       let color = data.color
//       console.log(typeof(data))
//       setPlayers(prev => [...prev,{
//         "username" : data.username,
//         "img" : data.img,
//         "score" : data.score,
//         "color" : `rgba(${color[0]},${color[1]},${color[2]},0.4)`
//       }])
//       return;}
    
//     else if(data.type === 1) {
//       setMSG(prev => [...prev,data])
    // }
}