import "../dist/output.css";
import { useRef } from "react";
import firework3 from "../image/firework1.gif";

export const WinningCard = ({socket}) => {
    const winRef = useRef(null);
    const nameRef = useRef(null);
    //receive to generate question alert from server
  socket.on("reset",(gameover)=>{
    if(gameover){
      nameRef.current.value = "Player quit";
    }
    else {
      window.location.reload();
    }
    
  })
    const refreshPlay = ()=>{
      window.location.reload();
    }
    socket.on("win",(id)=>{
      console.log("win id is "+JSON.stringify(id))
        winRef.current.classList.remove('hidden');
         if(id == socket.id) { 
           nameRef.current.value = "You Win";
         }else { 
          nameRef.current.value = "Player1 Win"
         }   
    
    })

    socket.on("draw",(id)=>{
      
        winRef.current.classList.remove('hidden');
        nameRef.current.value = "Draw"  
    
    })

  
    return (
      <div className="hidden absolute h-full w-full z-50 flex flex-col justify-center items-center bg-grey bg-opacity-30" ref={winRef}>
              <div className="flex flex-col justify-center items-center shadow-lg rounded-md h-[400px] max-w-[450px] p-6  bg-white text-center">
                
                  <img src={firework3} alt="" className="w-full h-full bg-center bg-cover rounded-md" /> 
                  <input type="text" value={""} className="absolute z-50 focus:outline-none bg-primary text-blue text-2xl w-25 text-center p-2 rounded-sm  bg-opacity-0"  
                  ref={nameRef} readOnly/> 
                  <button type="button" onClick={refreshPlay} className="z-50 bg-right focus:outline-none  text-white text-xl w-25 text-center p-2 rounded-sm  shadow-lg mb-2"  
                  >Play Again</button> 
               {/* 
                */}
              </div>
                
        </div>
    );
}