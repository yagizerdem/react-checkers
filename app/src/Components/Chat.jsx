import { useRef, useState } from "react"
import { socket } from "../socket"
import { useGame } from "../Context/GameConext"
import useKey from "../Hooks/useKey"
export default function Chat(){
    const [isInputFocuesed , setIsInputFocused] = useState(false)
    const {allChat , setAllChat} = useGame()
    const inputRef = useRef()
    function clickHandler(){
        var data = inputRef.current.value
        if(data.trim() == "") return
        socket.emit('sendchat',inputRef.current.value)
        setAllChat((prev)=>{
            const newChats = [...prev]
            newChats.push({data:data , user:'main'})
            return newChats
        })
        inputRef.current.value = ''
    }
    useKey("Enter" ,()=>{
        if(isInputFocuesed){
            clickHandler()
            inputRef.current.blur()
            setIsInputFocused(false)
        }else{
            inputRef.current.focus()
            setIsInputFocused(true)
        }
    })
    useKey("Escape" ,()=>{
        inputRef.current.blur()
        setIsInputFocused(false)
    })

    function leaveMatch(){
        location.reload()
    }

    return(
        <div className="chat-container">
            <div className="screen"> 
                {allChat.map((chatdata , i)=>{
                    return (
                        <div key={i} className={'chat chat-'+chatdata.user}>
                        {chatdata.data}
                    </div>
                    )
                })}
            </div>
            <input className="chat-input" type="text" placeholder="you can chat" ref={inputRef}></input>
            <button className="sendchat" onClick={clickHandler}>Send</button>
            <button className="leavematch" onClick={leaveMatch}>Leave room</button>
        </div>
    )
}