export const SocketHandler = (message) => {
    let data =  JSON.parse(message.data)
    console.log(data);
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