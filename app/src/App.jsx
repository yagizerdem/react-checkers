import "./App.css";
import { GameProvider } from "./Context/GameConext.jsx";
import AppLayout from "./Layouts/AppLayout.jsx";
import { SocketProvider } from "./Context/SocketContext.jsx";
import { useEffect } from "react";
import { socket } from './socket';

function App() {

  useEffect(()=>{
    socket.connect()
  },[])

  return (
    <SocketProvider>
      <GameProvider>
        <AppLayout></AppLayout>
      </GameProvider>
    </SocketProvider>
  );
}

export default App;
