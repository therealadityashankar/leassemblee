export function EnterCode({className, minimized}: {className?: string, minimized?: boolean}) {
    return (
           <div className="card card-border bg-base-100 w-96">
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <h2 className="rounded-full bg-primary text-primary-content p-1.5 h-5 w-5 leading-[0.5]">3</h2>
                        <h2 className="card-title">Enter Code</h2>
                    </div>

                    {!minimized && (<>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Buy Now</button>
                        </div>
                    </>)}
                </div>
            </div>
    )
}