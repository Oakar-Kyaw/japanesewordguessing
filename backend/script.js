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
    let askedquestion = [];
    let personGenerateQuestion;
    clientCount++;
    //find if there is any vacant room
    let index = rooms.findIndex(room => room.vacant == true);
    if(index >= 0 ){
        let player1;
        const room = rooms[index];
        //player properties of room objects
        room.players[socket.id]={ 
              point:0,
              playsong:false
        }
        room.vacant = false;
        //join room using id
        socket.join(room.roomId);

        for (let player in room.players){
          if (player != socket.id){
           player1 = player;
          }
        }
        //to generate question only once
        room.questionPerson = socket.id;

       //emit join event to client
        io.to([room.id,socket.id,player1]).emit("joined",socket.id,room.questionPerson);
        
    }
    else {
        //create room if there is no vacant or first user
       const room = {
        roomId: generateRoomId() ,
        vacant:true,
        playfirst:0,
        attempt:3,
        level:0,
        questionPerson:0,
        questionIndex:[],
        gameover:false,
        players:{
            [socket.id]:{
                point:0,
                playsong:false
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
      //check if the player play more than 5 question
      if(room.level > 4){
         room.gameover=true;
         //compare the score
         if(room.players[id].point > room.players[nextClient].point ){
             winUser = id;
             io.to([foundRoomId,id,nextClient]).emit('win',winUser)
             
         }
         else if (room.players[id].point < room.players[nextClient].point){
              winUser = nextClient;
              io.to([foundRoomId,id,nextClient]).emit('win',winUser)
              
         }
         else {
          io.to([foundRoomId,id,nextClient]).emit('draw')
          
         }
      
     }
      else {
         let random;
        //check random number not to overlap
        do {
          random = Math.round(Math.random() * (Questions.length -1));
        }while(room.questionIndex.includes(random))
          let question = Questions[random].question ;
          let answer = Questions[random].rightanswer;
          let questionanswer = Questions[random].answer;
         //push generate number to room's questionIndex array
          room.questionIndex.push(random);
          //send question to client
          io.to([foundRoomId,id,nextClient]).emit('question',question,answer,questionanswer)
      
      }
    })
    //when the user click first
    socket.on('clickFirst',(id)=>{
       let nextClient;
       let setPlayerFirst;
      
       //search roomId using id parameter
       let foundRoomId = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == foundRoomId);
       let room = rooms[roomIndex];
       for (let player in room.players){
         if (player != id){
          nextClient = player;
         }
       }
       if(!room.gameover && nextClient){
       
       //only set true when the user click button that made to answer first
       room.players[id].playsong = true;
       //if playfirst doesn't have id, then set playfirst to id
       if(room.playfirst == 0){
         room.playfirst = id;
         setPlayerFirst = true;
       }       
       //to get both of the client , write io.to([roomid,senderid,receiverId]).emit()
      io.to([foundRoomId,id,nextClient]).emit('setActive',room.playfirst,foundRoomId,setPlayerFirst)
       } 
    })

   
     
     //when user submit answer and add point when the user is right
     socket.on("addPoint",(id)=>{
        let nextClient;
        let roomid = searchRoomId(rooms,id);
        let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
        let room = rooms[roomIndex];
        // add point when the user is right
        room.players[id].point++;
        for (let player in room.players){
          if (player != id){
           nextClient = player;
          }
        }
      //send point event to room , in annoucement.jsx  
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
      //if the attempt value is 0, emit trueAnswer emit to announce.jsx
      if(attempt == 0 ){
        setTimeout(()=>{io.to([foundRoom,id,nextPlayer]).emit('showTrueAnswer',room.questionPerson)},2000)
      }
      else{
      //if the attempt value isn't 0, subtract 1 to that value
      room.playfirst = nextPlayer;
      setPlayerFirst = true;
      room.attempt--;
      //emit showfalse event to answerinput.jsx
      io.to([foundRoom,id,nextPlayer]).emit('showFalse');
      // emit setactive event to answersubmit.jsx
       io.to([foundRoom,id,nextPlayer]).emit('setActive',room.playfirst,foundRoom,setPlayerFirst); 

       }
       })

 
     //show correct answeer in input
     socket.on("showAnswer",(answer,id)=>{
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
        room.attempt = 3;
        room.level++ ;
        //emit show event to answerinput.jsx
        io.to([roomid,id,nextClient]).emit('show',answer,id)
        //emit nextQuestion to question.jsx, id to emit only once checing whether id and client.id is equal or not, questionPerson to emit not to overlap questionIndex 
        setTimeout(()=>{
         io.to([roomid,id,nextClient]).emit('nextQuestion',id,room.questionPerson) 
        },2000)
        
        
    })

    //emit play song from server when the user is right
    socket.on("playRight",(id)=>{
       let nextClient;
       let playSongId;
       let roomid = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
       let room = rooms[roomIndex];
       
        for (let player in room.players){
          if (player != id){
           nextClient = player;
          }
        }
        //to play song both of the player
        if(room.players[id].playsong && room.players[id].playsong ){
          io.to([roomid,id,nextClient]).emit('playright',true)
        }
        //chose only id tha can play song
        else{
           if(room.players[id].playsong){
             playSongId = id ;
           }
           else {
             playSongId = nextClient
           }
           io.to([roomid,id,nextClient]).emit('playright',false,playSongId)
        }
       
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

    //to show false icon 
    socket.on("showFalseIcon",(id)=>{
       let next;
      let roomid = searchRoomId(rooms,id)
       let roomIndex = rooms.findIndex(room=> room.roomId == roomid);
       let room = rooms[roomIndex];
       for (let player in room.players){
          if (player != id){
           next = player;
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
       
          
         if (nextClient && room.gameover){
          io.to([roomid,nextClient]).emit('reset',true)
         }
         else if(nextClient && !room.gameover){
             //Reset the room properties 
          delete room.players[socket.id]
          room.vacant = true;
          room.playfirst = 0;
          room.attempt = 3;
          room.level = 0;
          room.questionPerson = 0;
          room.players[nextClient].point = 0;
          room.players[nextClient].playsong = false;
         
          io.to([roomid,nextClient]).emit("point",room.players[nextClient].point);

          //emit event to disappar waiting card
          io.to([roomid,socket.id,nextClient]).emit('waiting')
         }
         else  {
         rooms.splice(roomIndex,1);
        
          io.to([roomid,nextClient]).emit('reset',false)
         }
       
        
      }
    )


 });
server.listen(PORT,()=>{
})