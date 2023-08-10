import "../dist/output.css";
import { useFormik
 } from "formik";
 import "../dist/output.css";
import { Questions } from "../constant/constant";
import { useEffect, useRef, useState } from "react";
import rightsong from "../music/right.m4a";
import wrongsong from "../music/wrong.m4a";
export const AnswerSubmit =({socket})=>{
     
     const submitbutton = useRef();
     const rightRef = useRef(null);
     const wrongRef = useRef(null);
    

     //when receive play right 
     socket.on("playright",()=>{
       rightRef.current.play()
     })

     //when receive play right 
     socket.on("playwrong",()=>{
      wrongRef.current.play()
     })

    
     //deactivate or activate submit button function
     const Buttons = (disableButton,bgColor,color)=>{
       submitbutton.current.disabled= disableButton;
       submitbutton.current.classList.add(`${bgColor}`);
       submitbutton.current.classList.remove(`${color}`);
     }

      //deactivate submit button cause next Question
      socket.on('nextQuestion',()=>{
          Buttons(true,"bg-buttonDisable","bg-right");
      })

      //to show true answer 
    socket.on("showTrueAnswer",()=>{
          Buttons(true,"bg-buttonDisable","bg-right");
      })
     
      //acitvate submit button
      socket.on("setActive",(receiveId)=>{
        
        console.log("receiver id  is "+receiveId);
        console.log("id is "+socket.id)
        if(socket.id == receiveId){
          Buttons(false,"bg-right","bg-buttonDisable");
        }
        else {
          Buttons(true,"bg-buttonDisable","bg-right");
        }
      
     })
     
     
    const formik = useFormik({
      initialValues:{
        answer:""
      },
      onSubmit:(value)=>{
        socket.emit("submit",socket.id)
        const answer = JSON.parse(localStorage.getItem('question')).answer;
        
         console.log("this is submit value "+answer)
          let answerExist = answer.findIndex(answer=>{
            console.log("saved answer is "+answer)
           return answer.toUpperCase() == value.answer.toUpperCase()});
          if(answerExist >= 0){
            rightRef.current.play()
            socket.emit("isTrue",socket.id)
            socket.emit("addPoint",socket.id)
            socket.emit("showAnswer", answer,socket.id,false);
           }
          
          else {
           wrongRef.current.play();
          }
        

      }
    })
    return (
      <section className="bg-primary">
        <form onSubmit={formik.handleSubmit}  className="flex flex-col
        space-y-4 items-center">
            <input type="text" id="answer" name="answer" onChange={formik.handleChange} value={formik.values.answer} className=" rounded-full shadow-lg h-8 font-poppins p-4 focus:outline-none w-[350px] " placeholder="Your Answer" />
            <audio ref={rightRef} src={rightsong} />
            <audio ref={wrongRef} src={wrongsong} />
            <button ref={submitbutton} className="bg-buttonDisable p-2 text-white font-poppins rounded-md shadow-lg" disabled={true} type="submit">Submit</button>
        </form>
         
      </section>
    );
}