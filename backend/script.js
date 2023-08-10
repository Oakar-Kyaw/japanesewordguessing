const express = require('express')
require('dotenv').config()
const socketIo = require('socket.io')
const http = require('http')
const cors = require('cors');
const Questions  = require('./constant/constant');
const PORT =  3001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server,{ 
    cors: {
      origin: ["http://localhost:3000","https://japanesewordguessing.web.app"]
    }
})


app.use(cors());
let clientCount=0;
let rooms=[];

//generate room id 
const generateRoomId = ()=> {
  return Math.random().toString(36).substring(2, 6);
}
//to search room id and return 
const searchRoomId = (totalroom,id)=>{
    const desiredPlayerId = id;
    let matchingRoomId ;
    //loop throug rooms array 
    for (const room of totalroom) {
      const players = room.players;
      //check  id in players and if match return room id
      if (desiredPlayerId in players) {
        matchingRoomId = room.roomId;
        return matchingRoomId;
        
      }
    }
}


  
io.on('connection', (socket) => { 
   
    clientCount++;
    //find if there is any vacant room
    let index = rooms.findIndex(room => room.vacant == true);
    if(index >= 0 ){
        let player1;
        const room = rooms[index];
        room.players[socket.id]={ 
              point:0,
        }
        room.vacant = false;
        
        socket.join(room.roomId);
        for (let player in room.players){
          if (player != socket.id){
           player1 = player;
          }
        }
        io.to([room.id,socket.id,player1]).emit("joined");
       
        console.log("room are "+ JSON.stringify(rooms))
    }
    else {
        //create room if there is no vacant or first user
       const room = {
        roomId: generateRoomId() ,
        vacant:true,
        playfirst:0,
        attempt:4,
        level:0,
        players:{
            [socket.id]:{
                point:0,
            }
        }
       }
       rooms.push(room); 
       //waiting for other player 
       io.to([room.id,socket.id]).emit("waiting");
    }
    

    //generate question 
    socket.on("generateQuestion",(id)=>{
      let nextClient;
      let winUser;
      let foundRoomId = searchRoomId(rooms,id)
      let roomIndex = rooms.findIndex(room=> room.roomId == foundRoomId);
      let room = rooms[roomIndex];
      for (let player in room.players){
        if (player != id){
         nextClient = player;
        }
      }
      
      
      if(room.level > 3){
      
         if(room.players[id].point > room.players[nextClient].point ){
             winUser = id;
             console.log("win User is "+ winUser)
             io.to([foundRoomId,id,nextClient]).emit('win',winUser)
            
         }
         else if (room.players[id].point < room.players[nextClient].point){
              winUser = nextClient;
              console.log("win User is "+ winUser)
              io.to([foundRoomId,id,nextClient]).emit('win',winUser)
              
         }
         else {
          io.to([foundRoomId,id,nextClient]).emit('draw')
          
         }
         
     }
      else {
        let random = Math.round(Math.random()*3);
        let question = Questions[random].question ;
        let answer = Questions[random].answer;
        console.log("generatequestion is "+question+ " "+ answer)
        //send to client
        io.to([foundRoomId,id,nextClient]).emit('question',question,answer)

      }
      

    })
    //when the user click first
    socket.on('clickFirst',(id)=>{
       let nextClient;
       let setPlayerFirst;
       let foundRoomId = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == foundRoomId);
       let room = rooms[roomIndex];
       for (let player in room.players){
         if (player != id){
          nextClient = player;
         }
       }
       if(room.playfirst == 0){
         room.playfirst = id;
         setPlayerFirst = true;
       }

       
       //to get both of the client , write io.to([roomid,senderid,receiverId]).emit()
      io.to([foundRoomId,id,nextClient]).emit('setActive',room.playfirst,foundRoomId,setPlayerFirst)
       
    })

   
     
     //when user submit answer and add point when the user is right
     socket.on("addPoint",(id)=>{
        let nextClient;
        let roomid = searchRoomId(rooms,id);
        let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
        let room = rooms[roomIndex];
        room.players[id].point++;
        for (let player in room.players){
          if (player != id){
           nextClient = player;
          }
        }
        
         
      io.to([roomid,id,nextClient]).emit("point",room.players[id].point,id);
     

    })

     //when user submit answer and give false answer
     socket.on("falseAnswer",(id)=>{
      
      
      let nextPlayer;
      let setPlayerFirst;
      let foundRoom = searchRoomId(rooms,id);
      let roomIndex = rooms.findIndex(room=>room.roomId == foundRoom);
      let room = rooms[roomIndex];
      let player = rooms[roomIndex].players;
      let attempt = room.attempt;
      for(let playerId in player){
         if (playerId != id){
            nextPlayer= playerId;
         }
      }
      
      if(attempt == 0 ){
        setTimeout(()=>{io.to([foundRoom,id,nextPlayer]).emit('showTrueAnswer')},2000)
      }
      else{
      room.playfirst = nextPlayer;
      setPlayerFirst = true;
      room.attempt--;
      
      //io.to([foundRoom,id,nextPlayer]).emit('stopTimer');
      io.to([foundRoom,id,nextPlayer]).emit('showFalse');
     
       io.to([foundRoom,id,nextPlayer]).emit('setActive',room.playfirst,foundRoom,setPlayerFirst); 

       }
       })

 
     //show correct answeer in input
     socket.on("showAnswer",(answer,id,notAddLevel)=>{
       let nextClient;
       let roomid = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
       let room = rooms[roomIndex];
       
        for (let player in room.players){
          if (player != id){
           nextClient = player;
          }
        }
        room.playfirst= 0;
        room.attempt = 4;
        if(!notAddLevel){
            room.level++ ;
        }
        console.log("room are leevel are"+ JSON.stringify(rooms))
        io.to([roomid,id,nextClient]).emit('show',answer,id)

        setTimeout(()=>{
         io.to([roomid,id,nextClient]).emit('nextQuestion') 
        },1000)
        
        
    })

    //emit play song from server when the user is right
    socket.on("playRight",(id)=>{
      let nextClient;
       let roomid = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
       let room = rooms[roomIndex];
       
        for (let player in room.players){
          if (player != id){
           nextClient = player;
          }
        }
        io.to([roomid,id,nextClient]).emit('playright')
    })

    //emit play song from server when the user is wrong
    socket.on("playWrong",(id)=>{
      let nextClient;
       let roomid = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
       let room = rooms[roomIndex];
       
        for (let player in room.players){
          if (player != id){
           nextClient = player;
          }
        }
        io.to([roomid,id,nextClient]).emit('playwrong')
    })

    

    //stop timer
    socket.on("showFalseIcon",(id)=>{
       let nextClient;
      let roomid = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
       let room = rooms[roomIndex];
       for (let player in room.players){
          if (player != id){
           nextClient = player;
          }
       }
       io.to([roomid,id]).emit('showFalse')
    })
    socket.on('disconnect',()=>{
       let nextClient;
       let roomid = searchRoomId(rooms,socket.id)
       let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
       let room = rooms[roomIndex];
        for (let player in room.players){
          if (player != socket.id){
           nextClient = player;
          }
        }

        io.to([roomid,socket.id,nextClient]).emit('waiting')
    })


 });
server.listen(PORT,()=>{
    console.log("server i s runding at port "+PORT)
})