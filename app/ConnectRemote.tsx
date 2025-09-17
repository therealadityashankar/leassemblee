"use client"
import { Peer } from "peerjs";
import { useState } from "react";

export default function ConnectRemote({className}: {className?: string}) {
    let [peer, setPeer] = useState<Peer | null>(null);
    let [inputValue, setInputValue] = useState<string>("");
    let [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    let [sendConn, setSendConn] = useState<any>(null);
    let [recieveConn, setRecieveConn] = useState<any>(null);
    let [motorStates, setMotorStates] = useState<any>([ ]);

    if (!peer) {
        peer = new Peer()
        setPeer(peer);
    }

    function connectPeer(id: string) {
        if (!peer) return;

        const sendConn = peer.connect(id);

        sendConn.on('open', function() {
            console.log('Connection established with peer:', id);
            sendConn.send({ type: 'hello', message: 'Hello from the controller!' });

            sendConn.on('data', function(data) {
                console.log('Received data from peer - on the connection part:', data);
            });
        });

        sendConn.on("error", (err) => {
            console.error("Connection error:", err);
        });

        sendConn.on("close", () => {
            console.log("Connection closed");
        });


        peer.on('call', function(call) {
            call.answer();
            call.on('stream', function(stream) {
                console.log('Received remote stream:', stream);
                setVideoStream(stream);
            });
        });

        peer.on("connection", (conn) => {
            setRecieveConn(conn);

            console.log("receiving data connection established with peer:--", conn.peer, "metadata:", conn.metadata);

            conn.on('data', function(data : any) {
                console.log('Received data from peer - on the recieving part:', data);

                if(data.type === "readValues"){
                    setMotorStates(data.motorValues.motorConfigs)
                }
            });

            conn.on("error", (err) => {
                console.error("Connection error:", err);
            });
        });


        setSendConn(sendConn);
    }

    return (
        <div className="card w-96 bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex justify-between">
                <h2 className="text-3xl font-bold">Remote control a robot</h2>
                </div>
                <div className="mt-3">
                    <p className="mb-4">Enter the code displayed on your robot to connect to it remotely.</p>
                    <input type="text" placeholder="Enter code" className="input input-bordered w-full mb-8" onChange={(e) => setInputValue(e.target.value)} />
                    <button className="btn btn-primary btn-block rounded-xl" onClick={() => connectPeer(inputValue)}>Connect</button>
                </div>

                {videoStream && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Robot Camera Feed:</h3>
                        <video
                            autoPlay
                            playsInline
                            muted
                            ref={(video) => {
                                if (video && videoStream) {
                                    video.srcObject = videoStream;
                                }
                            }}
                            className="w-full h-auto rounded-md border"
                        />
                    </div>
                )}

                {/* Robot Control Panel, iterate through motorStates and create controls for each motor */}
                {motorStates && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Robot Control Panel:</h3>
                        {motorStates && motorStates.map((motorConfig : any) => (
                            <div key={motorConfig.id} className="mb-2">
                                <h4 className="font-semibold">{motorConfig.name}</h4>
                                <p>Position: {motorConfig.currentPosition}</p>
                                {/* Add controls for each motor, i.e. a slider for position */}
                                <input
                                    type="range"
                                    min={motorConfig.minPosition}
                                    max={motorConfig.maxPosition}
                                    step="1"
                                    value={motorConfig.currentPosition}
                                    onChange={(e) => {
                                        sendConn?.send({ type: 'setValues', motorValues: { [motorConfig.name]: parseInt(e.target.value) } });
                                        setMotorStates((prevStates: any) => prevStates.map((m: any) => m.id === motorConfig.id ? { ...m, currentPosition: parseInt(e.target.value) } : m));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}