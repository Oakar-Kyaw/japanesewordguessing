import "../dist/output.css";
import { useRef } from "react";

export const Announcement = ({socket}) => {
    const firstRef = useRef(0);
    const secondRef = useRef(0);
    const middleRef = useRef("ゲス");
    
    const announceRef = useRef("");

    //waiting for other player
    socket.on('waiting',()=>{
       
        announceRef.current.classList.add("justify-center")
        firstRef.current.classList.add("hidden")
        secondRef.current.classList.add("hidden")
        
        
    })
    
    //when the other user joined 
    socket.on("joined",()=>{
        firstRef.current.classList.remove("hidden")
        secondRef.current.classList.remove("hidden")
        
    })
    //to show next question 
    socket.on("nextQuestion",()=>{
        middleRef.current.classList.remove("text-mark")
        middleRef.current.value = "ゲス"
    })
    //to show true answer 
    socket.on("showTrueAnswer",()=>{
        const answer = JSON.parse(localStorage.getItem('question')).answer;
        socket.emit("showAnswer", answer,socket.id,true);
        socket.emit("playRight",socket.id);
        middleRef.current.classList.add("text-mark")
        middleRef.current.value = "Nobody is Right"
    })
   //to show point 
   socket.on("point",(point,id)=>{
       if(id == socket.id){
           firstRef.current.value = point;
           middleRef.current.classList.remove("text-mark")
           middleRef.current.value = "You Are Right"
       }
       else {
           secondRef.current.value = point;
           middleRef.current.classList.add("text-mark")
           middleRef.current.value = "Player1's Right"
       }
   })
   //to show who is to answer first in the middle 
   socket.on("setActive",(receiveId)=>{
   
    if(socket.id == receiveId){
       
        middleRef.current.classList.remove("text-mark")
        middleRef.current.value = "Your Turn"
    }
    else {
         middleRef.current.classList.add("text-mark")
         middleRef.current.value = "Player1's Turn"
    }
})
   
    return (
        <div className="flex space-x-1 justify-center p-2 "  ref={announceRef}>
        
         <input type="text" value={0} className="w-12 p-2 focus:outline-none  text-blue text-center shadow-lg rounded-[50%] "  
          ref={firstRef} readOnly/>  
             
           <input type="text" value={"ゲス"} className="focus:outline-none text-secondary text-[30px]  text-center p-1 " style={{backgroundColor: "transparent"}}
           ref={middleRef} readOnly/> 
           
           <input type="text" value={0} className="w-12 p-2 focus:outline-none  text-mark shadow-lg rounded-[50%]  text-center" 
            ref={secondRef} readOnly/>  
           
            
    

        </div>
       
    );
}