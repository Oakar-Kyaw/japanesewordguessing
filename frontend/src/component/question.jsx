import "../dist/output.css";
import { useEffect, useRef } from "react";
import { Questions } from "../constant/constant";

export const Question = ({socket})=>{
   let showQuestion;
   const showquestion = useRef(null)
   //receive to generate question alert from server

  //to generate question 
  socket.on("nextQuestion",()=>{
     socket.emit('generateQuestion',socket.id)
  })

   socket.on("question",(question,answer)=>{
        console.log('question '+question+" "+answer)
        showquestion.current.value = question ;

        localStorage.setItem('question', JSON.stringify({answer:answer,level:"level1"}))
   })
   
   
    return (
        <div className="p-4 m-6 w-screen space-y-3 justify-center items-center font-poppins bg-white">
        
        <h1 className="text-center text-mark font-[30px] font-bold">Question</h1>
        <p className="text-center"><input type="text" className="h-8 font-poppins p-4 focus:outline-none w-full text-center text-blue" ref={showquestion} value="" readOnly/>  </p>
       
    </div>
    );
}