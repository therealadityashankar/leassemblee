"use client"

import { Peer } from "peerjs";
import { useState } from "react";

export function EnterCode({className, minimized, streams}: {className?: string, minimized?: boolean, streams?: MediaStream[]}) {
    let [peer, setPeer] = useState<Peer | null>(null);
    let [peerId, setPeerId] = useState<string | null>(null);
    let [mediaConnection, setMediaConnection] = useState<any>(null);

    if (!minimized && !peer) {
        peer = new Peer()
        setPeer(peer);

        peer.on('open', function(id) {
            setPeerId(id);
        });

        peer.on("connection", (conn) => {
            const connectedPeerId = conn.peer;

            if(streams && streams.length > 0){
                const mediaConn = peer?.call(connectedPeerId, streams[0]);
                setMediaConnection(mediaConn);
            }

            conn.on('data', function(data) {
                console.log('Received data from peer:', data);
            });
        });
    }

    return (
           <div className={`card card-border bg-base-100 w-96 ${className ?? ""}`}>
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <h2 className="rounded-full bg-primary text-primary-content p-1.5 h-5 w-5 leading-[0.5]">3</h2>
                        <h2 className="card-title">Enter this code</h2>
                    </div>

                    {!minimized && (<>
                        <p>Connection ID : {peerId}</p>
                        <p>Enter this connection into the new device, to remotely connect to the robot!</p>
                    </>)}
                </div>
            </div>
    )
}