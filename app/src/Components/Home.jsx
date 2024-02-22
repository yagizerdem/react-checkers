import { useEffect, useRef, useState } from "react"
import useKey from "../Hooks/useKey"
import { gameStates } from "../Context/SD"
import  { socket } from "../socket"
import { useSocket } from "../Context/SocketContext"

export default function Home(){
    const [isFocused , setIsFocused] = useState(false)
    const {setGameState ,gameState} = useSocket()
    const inputRef = useRef()
    useKey("Enter" ,focus)
    useKey("Escape",blur)
    function focus(){
        setIsFocused(true)
        if(isFocused && inputRef.current != undefined && inputRef.current.value.trim() != ''){
            findMatch()
        }
    }
    function blur(){
        setIsFocused(false)
    }
    function findMatch(){
        setGameState(gameStates.SearcMatch)
        socket.emit("findmatch",inputRef.current.value.trim())
    }
    useEffect(()=>{
        if(gameState != gameStates.Home) return
        if(isFocused){
            inputRef.current.focus()
        }
        else{
            inputRef.current.blur()
        }
    },[isFocused,gameState])
    
    var body = gameState==gameStates.Home ? ( <>
    <div className="title">Checkers</div>
    <input type="text" minLength={12} placeholder="enter player name" className="player-name-input" ref={inputRef}></input>
    <button className="find-match" onClick={findMatch}>Find Match</button>
    </>):
    (<>
        <div className="title">Waiting for player ... </div>
        <br/>
        <span className="loader"></span>
    </>)
    return(
        
        <div className="home-container">
            {body}
        </div>
    )
}