export default function ConnectRemote({className}: {className?: string}) {
    return (
        <div className="card w-96 bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex justify-between">
                <h2 className="text-3xl font-bold">Remote control a robot</h2>
                </div>
                <div className="mt-3">
                    <p className="mb-4">Enter the code displayed on your robot to connect to it remotely.</p>
                    <input type="text" placeholder="Enter code" className="input input-bordered w-full mb-8" />
                    <button className="btn btn-primary btn-block rounded-xl">Connect</button>
                </div>
            </div>
        </div>
    )
}