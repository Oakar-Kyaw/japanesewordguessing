import "../dist/output.css";
import { useRef } from "react";
import loading from "../image/loading3.gif";

export const WaitingForOtherPlayer = ({socket}) => {
    const waitingRef = useRef(null);
    socket.on("waiting",()=>{
        waitingRef.current.classList.remove('hidden');
    })
    socket.on("joined",()=>{
        waitingRef.current.classList.add('hidden');
    })
    return (
      <div className="hidden transition-all ease-in-out delay-5200 duration-1000 absolute h-full w-full z-50 flex flex-col justify-center items-center bg-grey bg-opacity-30" ref={waitingRef}>
              <div className="flex flex-col space-y-4 justify-center items-center shadow-lg rounded-sm h-[400px] w-[450px] p-4  bg-white text-center">
                <div className="text-blue relative">
                  Waiting Other Player To Join 
                  <div className="absolute top-0 right-0 z-50 h-16 w-full animate-text bg-white">
                  </div> 
                
                  
                </div>
                <div className="">
                    <img src={loading} alt="" />
                </div>
              </div>
                
        </div>
    );
}