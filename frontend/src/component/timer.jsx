import "../dist/output.css";
import { useEffect, useRef, useState } from "react";

export const Timer = ({socket})=>{
    let secondRef = useRef(10);
    let intervalId;
    let timeoutId;
    let countdown = 25;

socket.on("setActive", (id, roomId ,setPlayerFirst) => {
  if (id === socket.id && setPlayerFirst) {
    secondRef.current.value = countdown;

    intervalId = setInterval(() => {
      countdown--;
      secondRef.current.value = countdown;
      
      if (countdown === 0) {
        countdown = 25;
        clearInterval(intervalId);
        return;
      }
    }, 1000);

    timeoutId = setTimeout(() => {
      socket.emit("falseAnswer", id);
      socket.emit("playWrong",socket.id)
    }, 25000);
  }
  
});


socket.on("nextQuestion", (answer, id) => {
  
  clearInterval(intervalId);
  clearTimeout(timeoutId);
  countdown = 25;
  secondRef.current.value = countdown;
});
    return (
        <section className="flex flex-col w-full ">
           <div className="flex flex-row items-center justify-center space-x-1 mb-2 mx-6 mt-2">
             <div className="flex items-center justify-center h-6 w-6 bg-primary shadow-lg rounded-sm" > 
             <input type="text" value={10} className="w-6 h-6 focus:outline-none bg-primary text-mark text-center"  
             ref={secondRef} readOnly/></div>
             <div className=" flex items-center justify-center h-6 w-6 bg-primary shadow-lg rounded-sm text-mark" >s</div>
            
             

           </div>
        </section>
    );
}