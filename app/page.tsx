"use client";
import ConnectRobot from './connectRobot';
import ConnectRemote from './ConnectRemote';
import { useEffect, useState } from 'react';
import { SiGooglechrome } from 'react-icons/si';


let browserSupportsWebSerial = navigator && 'serial' in navigator;

export default function Home() {
  const size = useWindowSize();
  const showConnectRobot = browserSupportsWebSerial && size.width && size.width >= 768; // only on desktop devices and where navigator.ser

  return (
    <main className="flex min-h-screen items-stretch w-full">
      {showConnectRobot && (<div className="w-1/2 flex flex-col items-center justify-center">
        <div className="flex items-center gap-4">
            <h2 className="card-title mb-3">Add an SO-101 to remote control</h2>
        </div>
        <ConnectRobot />
      </div>)}

      {/* vertical divider from DaisyUI */}
      {showConnectRobot && (<div className="divider divider-horizontal" >OR</div>)}

      <div className={`${showConnectRobot ? 'w-1/2' : 'w-full'} flex flex-col items-center justify-center`}>
        <div className="flex items-center gap-4">
            <h2 className="card-title mb-3">Remote control a robot</h2>
        </div>
        <ConnectRemote />

        {!browserSupportsWebSerial && (
          <div className="mt-5 mb-5 w-full max-w-md p-4 rounded-lg border bg-base-100 text-center">
            <div className="flex flex-col items-center gap-3">
              <SiGooglechrome className="w-10 h-10 text-[#4285F4]" />
              <div>
                <div className="font-bold">Use a Chromium-based browser to connect a robot</div>
                <div className="text-sm text-muted">
                  This browser doesn’t support Web Serial.  
                  To connect a robot, please use a Chromium browser (like Chrome or Edge) on a desktop.

                  You can, still remotely control robots connected to other devices though :)
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </main>
  );
}


function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
     
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}