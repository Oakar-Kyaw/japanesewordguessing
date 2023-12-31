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
     const rightRef = useRef("");
     const wrongRef = useRef("");
    

     //when receive play right 
     socket.on("playright",(playSong,playSongId)=>{
       if(playSong){
        rightRef.current.play()
       }
       else {
         if(socket.id == playSongId){

          rightRef.current.play()
         }
       }
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
           return answer == value.answer});
          if(answerExist >= 0){
            rightRef.current.play()
          
            socket.emit("addPoint",socket.id)
            socket.emit("showAnswer", answer,socket.id,false);
           }
          
          else {
           wrongRef.current.play();
          }
        

      }
    })
    return (
      <section className="">
        <form onSubmit={formik.handleSubmit}  className="flex flex-col
        space-y-2 items-center">
            <input type="text" id="answer" name="answer" onChange={formik.handleChange} value={formik.values.answer} className=" rounded-full shadow-lg h-8 font-poppins p-4 focus:outline-none min-w-[80px] " placeholder="Your Answer" />
            <audio ref={rightRef} src={rightsong} />
            <audio ref={wrongRef} src={wrongsong} />
            <button ref={submitbutton} className="bg-buttonDisable p-2 text-white font-poppins rounded-md shadow-lg" disabled={true} type="submit">Submit</button>
        </form>
         
      </section>
    );
}