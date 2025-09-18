"use client"
import { Peer } from "peerjs";
import { useState } from "react";
import { GrConnect } from "react-icons/gr";
import { FiCopy, FiCheckCircle } from 'react-icons/fi';

export default function ConnectRemote({className}: {className?: string}) {
    let [peer, setPeer] = useState<Peer | null>(null);
    let [inputValue, setInputValue] = useState<string>("");
    let [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    let [sendConn, setSendConn] = useState<any>(null);
    let [recieveConn, setRecieveConn] = useState<any>(null);
    let [motorStates, setMotorStates] = useState<any>([ ]);
    let [connected, setConnected] = useState<boolean>(false);
    let [connectedPeerId, setConnectedPeerId] = useState<string | null>(null);
    let [copied, setCopied] = useState<string | null>(null);

    if (!peer) {
        peer = new Peer()
        setPeer(peer);
    }

    function connectPeer(id: string) {
        if (!peer) return;

        const sendConn = peer.connect(id);

        sendConn.on('open', function() {
            setConnected(true);
            setConnectedPeerId(id);

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
        <div className="card card-border bg-base-100 w-96 ">
            <div className="card-body">
                <div className="flex items-center gap-4">
                    <GrConnect className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Enter a code to connect</h2>
                </div>
                <div className="mt-3">
                    <p className="mb-4">Enter the code displayed on your robot to connect to it remotely.</p>
                    <input type="text" placeholder="Enter code" className="input input-bordered w-full mb-8" onChange={(e) => setInputValue(e.target.value)} />
                    <button className="btn btn-primary btn-block rounded-xl" onClick={() => connectPeer(inputValue)}>Connect</button>
                </div>

                {connected && (
                    <div className="mt-3 p-3 rounded-md border border-green-200 bg-green-50">
                        <div className="flex items-center justify-between">
                            <div className="font-bold text-green-700">Connected to remote peer</div>
                            <FiCheckCircle className="text-green-600" />
                        </div>

                        <div className="mt-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="text-muted">This Peer:</div>
                                <div className="font-mono">{peer.id ?? '—'}</div>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={async () => {
                                        if (!peer.id) return;
                                        try {
                                            await navigator.clipboard.writeText(peer.id);
                                            setCopied(peer.id);
                                            setTimeout(() => setCopied(null), 2000);
                                        } catch (e) {
                                            console.error('Clipboard copy failed', e);
                                        }
                                    }}
                                >
                                    <FiCopy />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <div className="text-muted">Remote peer:</div>
                                <div className="font-mono">{connectedPeerId ?? '—'}</div>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={async () => {
                                        if (!connectedPeerId) return;
                                        try {
                                            await navigator.clipboard.writeText(connectedPeerId);
                                            setCopied(connectedPeerId);
                                            setTimeout(() => setCopied(null), 2000);
                                        } catch (e) {
                                            console.error('Clipboard copy failed', e);
                                        }
                                    }}
                                >
                                    <FiCopy />
                                </button>
                            </div>

                            {copied && <div className="text-sm text-success mt-2">Copied {copied}</div>}
                        </div>
                    </div>
                )}

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
                        {motorStates.length > 0 && <h3 className="text-lg font-semibold mb-2">Robot Control Panel:</h3>}
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