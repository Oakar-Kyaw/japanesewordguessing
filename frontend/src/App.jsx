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
//http://localhost:3000
   const socket = io("https://japanesewordgameapi.onrender.com/", {transports: ['websocket']});
   socket.on("saveRoom",(room)=>{
      localStorage.setItem('room',room)
   })
   return (
    <div className={`text-[18px] md:text-xl bg-primary font-poppins h-screen w-screen text-lg relative `} > 
       <WaitingForOtherPlayer socket={socket}/>
       <WinningCard socket={socket}/>
       <div className=" bg-[url(https://cdn.mos.cms.futurecdn.net/tnk229NQH3hSUPXLDBKNUA.jpg)] bg-center bg-cover p-1 w-screen">
       <Announcement socket={socket} /> 
       <Timer socket = {socket} />
       <AnswerInput socket={socket}  />
      
       <DescisionButton  socket={socket} />
       </div>
       
        <Question  socket={socket}/>
       <AnswerSubmit socket={socket}/> 
   </div>
       
   
   );
}
