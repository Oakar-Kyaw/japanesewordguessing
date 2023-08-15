import { useEffect, useState } from "react";
import "./dist/output.css";
import { Announcement } from "./component/annoucement";
import { AnswerInput } from "./component/answerinput";
import { AnswerSubmit } from "./component/answersubmit";
import { DescisionButton } from "./component/descisionbutton";

import japanese from './image/japanese.jpg';
import {io} from 'socket.io-client';
import { Question } from "./component/question";
import { WaitingForOtherPlayer } from "./component/waiting";
import { WinningCard } from "./component/win";
import { Timer } from "./component/timer";

export const App = ()=>{
  
//https://japanesewordgameapi.onrender.com/
//http://localhost:3001
   const socket = io("http://localhost:3001", {transports: ['websocket']});
   socket.on("saveRoom",(room)=>{
      localStorage.setItem('room',room)
   })
   return (
    <div className={`bg-[url(https://i.pinimg.com/originals/57/54/a2/5754a2831f178390c807231401c8b832.jpg)] bg-center bg-cover text-[25px] text-bold md:text-xl bg-primary font-novo h-full text-lg relative bg-white `} > 
       <WaitingForOtherPlayer socket={socket}/>
       <WinningCard socket={socket}/>
       <Announcement socket={socket} /> 
       <Timer socket = {socket} />
       <AnswerInput socket={socket}  />
       <DescisionButton  socket={socket} />
       <Question  socket={socket}/>
       <AnswerSubmit socket={socket}/> 
   </div>
       
   
   );
}
