import "../dist/output.css";
import { useEffect, useRef } from "react";
import { Questions } from "../constant/constant";

export const Question = ({socket})=>{
   
   const showquestion = useRef(null)
   const showanswer = useRef(null)
   //receive to generate question alert from server

  //to generate question 
  socket.on("nextQuestion",()=>{
     socket.emit('generateQuestion',socket.id)
  })

   socket.on("question",(question,answer,questionanswer)=>{
     
        showquestion.current.value = question ;
        showanswer.current.value = questionanswer ;
        localStorage.setItem('question', JSON.stringify({questionanswer:questionanswer,answer:answer}))
   })
   
   
    return (
        <div className="p-4 m-6   justify-center items-center font-poppins ">
        
        <h1 className="text-center text-mark font-[30px] font-bold mb-2">Question</h1>
        <div className="flex flex-col">
            <input type="text" className="flex p-4 focus:outline-none text-center text-secondary bg-primary flex-wrap"  ref={showquestion} value="" readOnly/>  
            <input type="text" className="p-4 focus:outline-none bg-primary text-center text-mark "   ref={showanswer} value="" readOnly/>  
        </div>
    </div>
    );
}