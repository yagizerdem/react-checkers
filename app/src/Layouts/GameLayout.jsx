import Board from "../Components/Board"
import Chat from "../Components/Chat"
import { useSocket } from "../Context/SocketContext"

export default function GameLayout(){
    // const {players} = useSocket()

    
    return(
        <div className="game-container">
        <Board></Board>
        <Chat></Chat>
        </div>

    )
}