"use client"
import { Peer } from "peerjs";
import { useState } from "react";

export default function ConnectRemote({className}: {className?: string}) {
    let [peer, setPeer] = useState<Peer | null>(null);
    let [inputValue, setInputValue] = useState<string>("");
    let [videoStream, setVideoStream] = useState<MediaStream | null>(null);

    if (!peer) {
        peer = new Peer()
        setPeer(peer);
    }

    function connectPeer(id: string) {
        if (!peer) return;

        const conn = peer.connect(id);

        conn.on('open', function() {
            console.log('Connection established with peer:', id);
        });

        conn.on('data', function(data) {
            console.log('Received data from peer:', data);
        });

        peer.on('call', function(call) {
            call.answer();
            call.on('stream', function(stream) {
                console.log('Received remote stream:', stream);
                setVideoStream(stream);
            });
        });
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
            </div>
        </div>
    )
}