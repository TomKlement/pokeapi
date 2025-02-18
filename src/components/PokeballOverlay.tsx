import { useState, useRef, useEffect } from "react";

function PokeballOverlay() {
  const [opened, setOpened] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    setOpened(true);
    videoRef.current?.play();
    audioRef.current?.play();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  return (
    <>
      {/* Video Background */}
      <video ref={videoRef} className="top-0 left-0 w-full h-full object-cover fixed z-[-1] scale-100" loop>
        <source src="/video.webm" type="video/webm" />
      </video>

      {/* Audio Background */}
      <audio ref={audioRef} loop>
        
        <source src="/song.mp3" type="audio/mp3" />
      </audio>

      {/* Pokéball Overlay */}
      <div onClick={handleOpen}>


    
        <div className={`fixed top-0 left-0 w-full h-1/2 bg-red-500 z-50 transition-transform duration-1000 ${opened ? "-translate-y-200" : "translate-y-0"}`}>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-32 bg-white border-16 border-black rounded-full" />
        </div>


        <div className={`fixed bottom-0 left-0 w-full h-1/2 bg-white z-40 transition-transform duration-1000 ${opened ? "translate-y-200" : "translate-y-0"}`}>
          <div className="absolute top-0 left-0 w-full h-[5px] bg-black" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 bg-gray-500 border-5 border-black rounded-b-full" />
        </div>

      </div>


    </>
  );
}

export default PokeballOverlay;
