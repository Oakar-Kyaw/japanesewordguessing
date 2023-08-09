import React, { useEffect, useRef } from 'react';
import firstHit from '../music/clickfirst.m4a';

export const DescisionButton = ({ socket }) => {
  const clickRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'f2' || event.key === 'F2') {
        socket.emit('clickFirst', socket.id);
        clickRef.current.play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

 
  //click first 
  const handleClick = () => {
    socket.emit('clickFirst', socket.id);
    clickRef.current.play();
   
  };

 
  return (
    <div className="flex justify-center mt-6">
      <div className = "hidden md:block text-blue p-4 text-xl">
        Press "F2" To Answer First
      </div>
      <audio ref={clickRef} src={firstHit} />
      <button className=" md:hidden text-white p-4 h-25 w-40 bg-mark rounded-sm" onClick={handleClick}>Click Here To Answer First</button>
    </div>
  );
};