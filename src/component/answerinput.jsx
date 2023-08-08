import "../dist/output.css";
import wrong from "../image/wrong.png";
import wrongsound from "../music/wrong.m4a";
import right from "../image/right.png";
import { useEffect, useRef } from "react";

export const AnswerInput = ({socket})=>{
    const showAnswer = useRef(null);
    const rightIcon = useRef(null);
    const falseIcon = useRef(null);

    socket.on("nextQuestion",()=>{
      showAnswer.current.value = "";
      rightIcon.current.classList.add("hidden");
    })

    //to show answer and answer icon
    socket.on("show",(answer)=>{
      showAnswer.current.value = answer;
      falseIcon.current.classList.add("hidden");
      rightIcon.current.classList.remove("hidden");
    })

    //to show false icon
    socket.on('showFalse',()=>{
      
      falseIcon.current.classList.remove("hidden");
    })

    return (
        <section className="answer-input flex flex-col w-full p-2">
           <div className="flex flex-row items-center justify-center space-x-4 mb-2 mx-6 mt-2">
          
            <div>
              <input type="text" className=" rounded-full shadow-lg h-8 font-poppins p-4 focus:outline-none w-[350px] " ref={showAnswer} placeholder="True Answer will show here"  readOnly/>  
            </div>
            
             <div className="hidden flex items-center justify-center h-6 w-6 bg-mark shadow-lg rounded-full" ref={falseIcon}><img src={wrong} alt="" className="" /></div>
             <div className="hidden flex items-center justify-center h-6 w-6 bg-right shadow-lg rounded-full" ref= {rightIcon}><img src={right} alt=""  /></div>
            
             

           </div>
        </section>
        
    );
}