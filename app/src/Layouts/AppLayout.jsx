import Home from "../Components/Home"
import { gameStates } from "../Context/SD"
import { useSocket } from "../Context/SocketContext"
import GameLayout from "./GameLayout"

export default function AppLayout(){
    const {gameState , setGameState} = useSocket()

    // useEffect(()=>{
    //     if(isMatchFound){
    //         setGameState(gameStates.Match)
    //     }
    // },[isMatchFound , setGameState])

    return(
        <>
            {(gameState == gameStates.Home || gameState == gameStates.SearcMatch) && <Home/>}
            {gameState == gameStates.Match && <GameLayout></GameLayout> }
        </>
    )
}