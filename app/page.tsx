import ConnectRobot from './connectRobot';
import ConnectRemote from './ConnectRemote';

export default function Home() {
  return (
    // Use items-stretch so both halves fill the full height, then give each side w-1/2
    <main className="flex min-h-screen items-stretch w-full">
      <div className="w-1/2 flex items-center justify-center">
        <ConnectRobot />
      </div>

      {/* vertical divider from DaisyUI */}
      <div className="divider divider-horizontal" >OR</div> 

      <div className="w-1/2 flex items-center justify-center">
        <ConnectRemote />
      </div>
    </main>
  );
}
