"use client"

import { GiRobotAntennas } from "react-icons/gi";
import { findPort } from "@lerobot/web";
import { useState } from "react";

export function ConnectRobot({className, minimized, onNext}: {className?: string, minimized?: boolean, onNext?: (robot: any) => void}) {

    let [robot, setRobot] = useState<any>(null);

    async function handleConnect() {
        const findProcess = await findPort();
        const robots = await findProcess.result;
        setRobot(robots[0]);
    }

    return (
           <div className={`card card-border bg-base-100 w-96 ${className ?? ""}`}>
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 flex items-center justify-center text-primary">
                            <GiRobotAntennas className="w-5 h-5" />
                        </div>
                        <h2 className="rounded-full bg-primary text-primary-content p-1.5 h-5 w-5 leading-[0.5]">2</h2>
                        <h2 className="card-title">Connect to a robot</h2>
                    </div>

                    {!minimized && (<>
                    <p>Click connect to connect a robot via lerobot.js</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={handleConnect}>Connect robot</button>
                    </div>

                    {robot && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => onNext?.(robot)}
                                >
                                    Next
                                </button>
                            </div>
                    )}
                </>)}
                </div>
            </div>
    )
}