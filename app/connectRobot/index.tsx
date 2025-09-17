"use client"

import { EnableWebcam } from "./enableWebcam"
import { ConnectRobot } from "./connectRobot"
import { EnterCode } from "./enterCode"
import { useState } from "react";

export default function connectRobot({className}: {className?: string}) {
    let [step, setStep] = useState(0);
    let [streams, setStreams] = useState<MediaStream[]>([]);
    let [robot, setRobot] = useState<any>(null);

    function onWebcamsAdded(_streams: MediaStream[]) {
        setStreams(_streams);
        setStep(1);
    }

    function onRobotConnected(_robot: any) {
        console.log("Connected to robot:", _robot);
        setRobot(_robot);
        setStep(2);
    }

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <EnableWebcam onNext={onWebcamsAdded} minimized={step !== 0} completed={step > 0} />
            <ConnectRobot onNext={onRobotConnected} minimized={step !== 1} />
            <EnterCode minimized={step !== 2} streams={streams} />
        </div>
    )
}