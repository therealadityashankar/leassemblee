"use client"
import { teleoperate } from "@lerobot/web";
import { Peer } from "peerjs";
import { useEffect, useState, useRef } from "react";

export function EnterCode({className, minimized, streams, robot}: {className?: string, minimized?: boolean, streams?: MediaStream[], robot?: any}) {
    let [peer, setPeer] = useState<Peer | null>(null);
    let [peerId, setPeerId] = useState<string | null>(null);
    let [mediaConnection, setMediaConnection] = useState<any>(null);
    let [connected, setConnected] = useState<boolean>(false);
    let [sendConn, setSendConn] = useState<any>(null);
    let [recieveConn, setRecieveConn] = useState<any>(null);

    const teleopRef = useRef<any>(null);

    function startTeleoperation() {
        const directTeleopPromise = teleoperate({
            robot,
        teleop: { type: "direct" }, // For programmatic control
        onStateUpdate: (state) => {
            //console.log(`Motors:`, state.motorConfigs);
        },
        })

        directTeleopPromise.then((directTeleop) => {
            directTeleop.start();
            teleopRef.current = directTeleop;
        })
    }

    useEffect(() => {
        if (robot && !teleopRef.current) {
            startTeleoperation();
        }
    }, [robot]);

    if (!minimized && !peer) {
        peer = new Peer()
        setPeer(peer);

        peer.on('open', function(id) {
            setPeerId(id);
        });

        peer.on("connection", (recieveConn) => {
            console.log("Data connection established with peer:--", recieveConn.peer);

            const connectedPeerId = recieveConn.peer;

            if(streams && streams.length > 0){
                const mediaConn = peer?.call(connectedPeerId, streams[0]);
                setMediaConnection(mediaConn);
            }

            const sendConn = peer?.connect(connectedPeerId, {metadata: "send-connectionoioioioioi"});
            setSendConn(sendConn);

            sendConn?.on('open', function() {
                console.log('Send connection established with peer:', connectedPeerId);
                sendConn?.send({ type: 'hello', message: 'Hello from the controller part a!' });

                const currentMotorPositions = teleopRef.current?.getState()
                sendConn?.send({
                    type: "readValues",
                    motorValues: currentMotorPositions,
                })
            });

            console.log(sendConn, "sent....send connection initial message!")

            recieveConn.on('data', function(data : any) {
                console.log('Received data from peer:', data);

                if(data.type === "setValues"){
                    teleopRef.current?.teleoperator.setMotorPositions(data.motorValues)
                }
            });

            recieveConn.on("error", (err) => {
                console.error("Connection error:", err);
            });

            recieveConn.on("close", () => {
                console.log("Connection closed");
                setConnected(false);
            });

            setRecieveConn(recieveConn);
            setConnected(true);
        });
    }

    return (
           <div className={`card card-border bg-base-100 w-96 ${className ?? ""}`}>
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <h2 className="rounded-full bg-primary text-primary-content p-1.5 h-5 w-5 leading-[0.5]">3</h2>
                        <h2 className="card-title">Enter this code</h2>
                    </div>

                    {!(connected) && (<>
                        <p>Connection ID : {peerId}</p>
                        <p>Enter this connection into the new device, to remotely connect to the robot!</p>
                    </>)}

                    {connected && <div className="text-green-500 font-bold">Connected to remote peer!</div>}
                </div>
            </div>
    )
}