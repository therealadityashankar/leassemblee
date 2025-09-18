"use client";

import React, {useEffect, useRef, useState} from "react";
import { FiCamera, FiCheck } from 'react-icons/fi';

type Props = {
    className?: string;
    minimized?: boolean;
    onCameraAdded?: (stream: MediaStream) => void;
    onNext?: (streams: MediaStream[]) => void;
    completed?: boolean;
};

export function EnableWebcam({className, minimized, onCameraAdded, onNext, completed}: Props) {
    const [streams, setStreams] = useState<MediaStream[]>([]);
    const videoRefs = useRef<Map<number, HTMLVideoElement | null>>(new Map());

    // attach streams to video elements
    useEffect(() => {
        streams.forEach((s, i) => {
            const el = videoRefs.current.get(i);
            if (el && el.srcObject !== s) {
                el.srcObject = s;
            }
        });
    }, [streams]);

    // cleanup on unmount: stop all tracks
    useEffect(() => {
        return () => {
            streams.forEach((s) => s.getTracks().forEach((t) => t.stop()));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function addCamera() {
        try {
            // If there are known devices but no specific device selected, request default
            // letting the browser decide which camera to grant. This avoids showing
            // an empty dropdown before permission is given.
            const constraints: MediaStreamConstraints = {
                video: true,
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // no enumeration or device-checking: we only request permission and use the stream

            setStreams((prev) => {
                const next = [...prev, stream];
                return next;
            });
            onCameraAdded?.(stream);
        } catch (err) {
            console.error("Failed to getUserMedia:", err);
            // optionally, show UI feedback - not required here
        }
    }

    function removeStream(index: number) {
        setStreams((prev) => {
            const s = prev[index];
            if (s) s.getTracks().forEach((t) => t.stop());
            const next = prev.filter((_, i) => i !== index);
            return next;
        });
        // cleanup videoRef map entry
        videoRefs.current.delete(index);
    }

    return (
        <div className={`card card-border bg-base-100 w-96 ${className ?? ""}`}>
            <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                    {/* left content */}
                    <div className="flex items-center gap-4">
                        {/* camera icon */}
                        <div className="w-6 h-6 flex items-center justify-center text-primary">
                        <FiCamera className="w-5 h-5" />
                        </div>
                        <h2 className="rounded-full bg-primary text-primary-content p-1.5 h-5 w-5 leading-[0.5]">1</h2>
                        <h2 className="card-title">Enable your webcam</h2>
                    </div>

                    {/* right content (check icon) */}
                    {completed && <div className="w-6 h-6 flex items-center justify-center text-success">
                        <FiCheck className="w-5 h-5" />
                    </div>}
                </div>

                {!minimized && (
                    <>
                        <p className="mt-2">Click <strong>Add Camera</strong> to grant camera permission and start a preview. Each added camera will appear below.</p>

                        <div className="mt-3 flex items-center gap-2">
                                        <div className="flex-1 text-sm text-muted">Click Add Camera to grant camera permission and start a preview.</div>

                                        <button className="btn btn-primary" onClick={addCamera}>Add Camera</button>
                                    </div>

                        <div className="mt-4 space-y-3">
                            {streams.map((s, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <video
                                        ref={(el) => { videoRefs.current.set(i, el); }}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="rounded-md border w-48 h-32 object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm">Camera #{i + 1}</div>
                                            <div className="space-x-2">
                                                <button className="btn btn-sm btn-ghost" onClick={() => removeStream(i)}>Remove</button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted mt-1">Streaming {s.getVideoTracks().length} video track(s)</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {streams.length > 0 && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => onNext?.(streams)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}