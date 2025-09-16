import { EnableWebcam } from "./enableWebcam"
import { ConnectRobot } from "./connectRobot"
import { EnterCode } from "./enterCode"


export default function connectRobot({className}: {className?: string}) {
    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <EnableWebcam />
            <ConnectRobot minimized={true} />
            <EnterCode minimized={true}  />
        </div>
    )
}