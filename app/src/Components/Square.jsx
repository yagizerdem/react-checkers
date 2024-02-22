import { useState } from "react"
import Piece from "./Piece"
import { useGame } from "../Context/GameConext"
import { useSocket } from "../Context/SocketContext"

export default function Square({className , row , col , piece}){
    const {selectSquareHandler , moveDTO} = useGame()
    var class_ = "square " + className
    function clickHandler(){
        selectSquareHandler( row , col )
    }
    if(moveDTO.from != null && (moveDTO.from[0] == row  && moveDTO.from[1] == col)){
        class_ += " selected"
    }
    return(
        <div className={class_} onClick={clickHandler}>
            {piece != 0 && <Piece color={piece.color} type={piece.type}></Piece>}
        </div>
    )
}