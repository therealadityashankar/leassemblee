export function EnableWebcam({className, minimized}: {className?: string, minimized?: boolean}) {
    return (
            <div className="card card-border bg-base-100 w-96">
                <div className="card-body">
                <div className="flex items-center gap-4">
                    <h2 className="rounded-full bg-primary text-primary-content p-1.5 h-5 w-5 leading-[0.5]">1</h2>
                    <h2 className="card-title">Enable your webcam</h2>
                </div>

                {!minimized && (<>
                    <p>Click enable webcam, and then allow your browser to see through the webcam!</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Enable Webcam</button>
                    </div>
                </>)}
                </div>
            </div>
    )
}