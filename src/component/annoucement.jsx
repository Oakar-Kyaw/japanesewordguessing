
import { useRef } from "react";

export const Announcement = ({socket}) => {
    const firstRef = useRef(null);
    const secondRef = useRef(null);
    const middleRef = useRef(null);
    const right = useRef(null);
    const left = useRef(null);
    const announceRef = useRef(null);

    //waiting for other player
    socket.on('waiting',()=>{
        right.current.classList.add("hidden")
        left.current.classList.add("hidden")
        announceRef.current.classList.remove("justify-between")
        announceRef.current.classList.add("justify-center")
        
    })
    
    //when the other user joined 
    socket.on("joined",()=>{
        right.current.classList.remove("hidden")
        left.current.classList.remove("hidden")
        announceRef.current.classList.add("justify-between")
        announceRef.current.classList.remove("justify-center")
    })
    //to show next question 
    socket.on("nextQuestion",()=>{
        middleRef.current.classList.remove("text-mark")
        middleRef.current.value = "ワード・ゲシング"
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
        <div className="flex justify-between  p-4 space-x-4" ref={announceRef}>
           <h1 className="font-poppins text-blue bg-primary p-1 rounded-sm shadow-lg text-center" ref={left}> You : <input type="text" value={0} className="focus:outline-none bg-primary text-blue w-5"  
           ref={firstRef} readOnly/></h1>

           <input type="text" value={"ワード・ゲシング"} className="focus:outline-none bg-primary text-blue w-25 text-center p-1 rounded-sm shadow-lg"  
           ref={middleRef} readOnly/> 

           <h1 className="font-poppins text-mark bg-primary p-1 rounded-sm shadow-lg text-center" ref={right}>Player 1 : <input type="text" value={0} className="w-5 focus:outline-none bg-primary text-mark"  
           ref={secondRef} readOnly/></h1>

        </div>
       
    );
}