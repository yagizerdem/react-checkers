import { createContext, useContext, useState ,useEffect} from "react"
import { socket } from '../socket';
import { gameStates } from "./SD"

const SocketContext = createContext();

function SocketProvider({children}){
    const [isConnected , setIsConnected] = useState(false)
    const [players , setPlayers] = useState(null)
    const [turn , setTurn] = useState(false)
    const [gameState , setGameState] = useState(gameStates.Home)
    const [opponentMove , setOpponentMove] = useState(null)
    const [opponentChat , setOpponentChat] = useState()
    const [gameEndMessage , setGameEndMessage] = useState(false)

    useEffect(() => {
        function onConnect() {
          setIsConnected(true);
        }
        function matchFound(playerData){
            setGameState(gameStates.Match)
            setPlayers(playerData)
            if(playerData.color == "white") setTurn(true)
        }
        function movepiece(dto){
            setOpponentMove(dto)
        }
        function switchTurn(){
            setTurn((prev)=>!prev)
        }
        function reciveChat(data){
            setOpponentChat(data)
        }
        function gameEnd(data){
            setGameEndMessage(data)
        }
        function opponentLeft(){
            setOpponentChat("opponent leave match")
        }
        socket.on('connect', onConnect);
        socket.on('matchfound',matchFound)
        socket.on('movepiece',movepiece)
        socket.on('switchturn',switchTurn)
        socket.on('recievechat',reciveChat)
        socket.on('gameend',gameEnd)
        socket.on('leavemathc',opponentLeft)

        return () => {
          socket.off('connect', onConnect);
          socket.off('matchfound', matchFound);
          socket.off('switchturn', movepiece);
          socket.off('switchturn',switchTurn)
          socket.off('recievechat',reciveChat)
          socket.off('recievechat',gameEnd)
        };
      }, []);

      
    return(
        <SocketContext.Provider value={{
            isConnected,
            players,
            gameState,
            setGameState,
            turn,
            setTurn,
            opponentMove,
            opponentChat,
            gameEndMessage
        }}>
            {children}
        </SocketContext.Provider>
    )
}

function useSocket(){
    const context = useContext(SocketContext)
    if(context === undefined){
        throw new Error("Socket context is undefined")
    }
    return context
}

export {SocketProvider , useSocket}