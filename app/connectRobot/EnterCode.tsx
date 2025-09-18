"use client"
import { teleoperate } from "@lerobot/web";
import { Peer } from "peerjs";
import { useEffect, useState, useRef } from "react";
import { GrConnect } from "react-icons/gr";
import { FiCopy, FiCheckCircle } from 'react-icons/fi';

export function EnterCode({className, minimized, streams, robot}: {className?: string, minimized?: boolean, streams?: MediaStream[], robot?: any}) {
    let [peer, setPeer] = useState<Peer | null>(null);
    let [peerId, setPeerId] = useState<string | null>(null);
    let [mediaConnection, setMediaConnection] = useState<any>(null);
    let [connected, setConnected] = useState<boolean>(false);
    let [sendConn, setSendConn] = useState<any>(null);
    let [recieveConn, setRecieveConn] = useState<any>(null);
    let [connectedPeerId, setConnectedPeerId] = useState<string | null>(null);
    let [copied, setCopied] = useState<string | null>(null);

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

            setConnectedPeerId(connectedPeerId);

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
                setConnectedPeerId(null);
            });

            setRecieveConn(recieveConn);
            setConnected(true);
        });
    }

    return (
           <div className={`card card-border bg-base-100 w-96 ${className ?? ""}`}>
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 flex items-center justify-center text-primary">
                            <GrConnect className="w-5 h-5" />
                        </div>
                        <h2 className="rounded-full bg-primary text-primary-content p-1.5 h-5 w-5 leading-[0.5]">3</h2>
                        <h2 className="card-title">Enter this code</h2>
                    </div>

                    {(!minimized && !connected) && (<>
                        <div className="flex items-center gap-2">
                            <div className="text-sm">Connection ID:</div>
                            <div className="font-mono">{peerId ?? '—'}</div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={async () => {
                                    if (!peerId) return;
                                    try {
                                        await navigator.clipboard.writeText(peerId);
                                        setCopied(peerId);
                                        setTimeout(() => setCopied(null), 2000);
                                    } catch (e) {
                                        console.error('Clipboard copy failed', e);
                                    }
                                }}
                                aria-label="Copy connection id"
                            >
                                <FiCopy />
                            </button>
                            {copied === peerId && <span className="text-sm text-success ml-2">Copied!</span>}
                        </div>

                        <p className="mt-2">Enter this connection id into the new device to remotely connect to the robot.</p>
                    </>)}

                    {connected && (
                        <div className="mt-3 p-3 rounded-md border border-green-200 bg-green-50">
                            <div className="flex items-center justify-between">
                                <div className="font-bold text-green-700">Connected to remote peer</div>
                                <FiCheckCircle className="text-green-600" />
                            </div>

                            <div className="mt-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="text-muted">This Peer:</div>
                                    <div className="font-mono">{peerId ?? '—'}</div>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={async () => {
                                            if (!peerId) return;
                                            try {
                                                await navigator.clipboard.writeText(peerId);
                                                setCopied(peerId);
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
                </div>
            </div>
    )
}