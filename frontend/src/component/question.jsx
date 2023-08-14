import "../dist/output.css";
import { useEffect, useRef } from "react";
import { Questions } from "../constant/constant";

export const Question = ({socket})=>{
   
   const showquestion = useRef(null)
   const showanswer = useRef(null)
   //receive to generate question alert from server
   socket.on("joined",(receiveid,personGenerateQuestion)=>{
    if(socket.id === receiveid ){
       socket.emit('generateQuestion',personGenerateQuestion) 
    }
     
  })
  
  //to generate question 
  socket.on("nextQuestion",(receiveid,personGenerateQuestion)=>{
    if(socket.id === receiveid ){
       socket.emit('generateQuestion',personGenerateQuestion) 
    }
     
  })

   socket.on("question",(question,answer,questionanswer)=>{
        showquestion.current.value = question ;
        showanswer.current.value = questionanswer ;
        localStorage.setItem('question', JSON.stringify({questionanswer:questionanswer,answer:answer}))
   })
   
   
    return (
        <div className="p-4 justify-center items-center ">
        
        <h1 className="text-center text-mark font-[30px] font-bold mb-2">Question</h1>
        <div className="flex flex-wrap flex-col">
            <input type="text" className="flex p-4 focus:outline-none text-center text-blue min-w-[150px] "  ref={showquestion} value="" style={{backgroundColor:"rgb(192,192,192,0.5)"}} readOnly/>  
            <input type="text" className="p-4 focus:outline-none bg-primary text-center text-mark min-w-[150px]" style={{backgroundColor:"rgb(192,192,192,0.5)"}} ref={showanswer} value="" readOnly/>  
        </div>
    </div>
    );
}