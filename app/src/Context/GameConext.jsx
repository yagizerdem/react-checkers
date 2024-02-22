import { createContext, useContext, useEffect, useReducer, useState } from "react"
import initialBoard from "../Engine/InitialBoard"
import { useSocket } from "./SocketContext"
import { socket } from "../socket"
import { FindStrictMoves, Validate, hasStrictMove ,hasMove } from "../Engine/Evaluate"

const GameContext = createContext()

function reducer(state , action){
    var deepCopy = {...state}
    if(action.type == "selectfrom"){
        deepCopy.from = action.payload
        return deepCopy
    }
    else if(action.type == "selectto"){
        deepCopy.to = action.payload
        return deepCopy
    }
    else if(action.type == "selectpiece"){
        deepCopy.piece = action.board[action.payload[0]][action.payload[1]]
        return deepCopy
    }
    else if(action.type == "initial"){
        return {from:null,to:null,piece:null,eat:null}
    }
}


function GameProvider({children}){
    const {players , turn , setTurn , opponentMove,opponentChat,gameEndMessage} = useSocket()
    const [board , setBoard] = useState(()=>{
        return initialBoard
    })
    const [allChat ,setAllChat]=useState([])
    const [moveDTO , dispatch] = useReducer(reducer , {from:null,to:null,piece:null,eat:null})
    const [isGameEnd ,setIsGameEnd] = useState(false)

    function selectSquareHandler( row , col ){
        if(!turn) return
        const playerColor = players.color
        if(moveDTO.piece == null){
            if(board[row][col] != 0 && board[row][col].color == playerColor){
                dispatch({type:'selectfrom',payload:[row,col]})
                dispatch({type:'selectpiece',payload:[row,col],board})
            }
        }
        else{
            if(row == moveDTO.from[0] && col == moveDTO.from[1]) return
            if(board[row][col] != 0 && playerColor == board[row][col].color){
                dispatch({type:'selectfrom',payload:[row,col]})
                dispatch({type:'selectpiece',payload:[row,col],board})
                return
            }
            // move
            move({to:[row,col]})
        }

    }
    function move({to}){
        const dto = {...moveDTO}
        dto.to = to

        var {valid , eat} = Validate(dto , board)
        dto.eat = eat

        const initialStrictMoves = FindStrictMoves(players.color,board)
        const hasInitialStrictMove = initialStrictMoves.length > 0

        if(hasInitialStrictMove){
            var flag = false
            for(var move of initialStrictMoves){
                if(move.from[0] == dto.from[0] && move.from[1] == dto.from[1] && move.to[0] == dto.to[0] && move.to[1] == dto.to[1]){
                    flag = true
                    break
                }
            }
            valid = flag && valid
        }
        if(valid){
            // move
            var newBoard = []
            for(var row of board){
                newBoard.push([...row])
            }
            newBoard[dto.from[0]][dto.from[1]] = 0
            newBoard[dto.to[0]][dto.to[1]] = dto.piece

            if(dto.eat != null){
                newBoard[dto.eat[0]][dto.eat[1]] = 0
            }
            setBoard(newBoard)
            if((!hasStrictMove(players.color,newBoard) && hasInitialStrictMove) || !hasInitialStrictMove){
                setTurn((prev)=> !prev)
                socket.emit("switchturn")
            }
            socket.emit("movepiece" ,dto)
        }
        dispatch({type:'initial'})
    }

    useEffect(()=>{
        if(opponentMove == null) return
        setBoard((prev)=>{
            var newBoard = []
            for(var row of prev){
                newBoard.push([...row])
            }
            newBoard[opponentMove.to[0]][opponentMove.to[1]] = newBoard[opponentMove.from[0]][opponentMove.from[1]]
            newBoard[opponentMove.from[0]][opponentMove.from[1]] = 0

            if(opponentMove.eat != null){
                newBoard[opponentMove.eat[0]][opponentMove.eat[1]] = 0
            }

            return newBoard
        })
    },[opponentMove])
    useEffect(()=>{
        if(opponentChat == null || opponentChat == undefined) return
        setAllChat((prev)=>{
            const newChats = [...prev]
            newChats.push({data:opponentChat , user:'opponent'})
            return newChats
        })
    },[opponentChat])
    useEffect(()=>{
        var promote = false
        for(var i = 0 ; i <8;i++){
            if((board[0][i] != 0 && board[0][i].color == "white" && board[0][i].type == "pawn")
            ||
            (board[7][i] != 0 && board[7][i].color == "black" && board[7][i].type == "pawn")
            ){
                promote = true
            }   
        }
        var newBoard = [] // deep copy
        for(var row of board){
            newBoard.push([...row])
        }
        if(promote){
            setBoard(()=>{
                for(var i = 0 ; i <8;i++){
                    if(newBoard[0][i] != 0 && newBoard[0][i].color == "white" && newBoard[0][i].type == "pawn"){
                        newBoard[0][i] = {color:"white" , type:"king"}
                    }   
                    if(newBoard[7][i] != 0 && newBoard[7][i].color == "black" && newBoard[7][i].type == "pawn"){

                        newBoard[7][i] =  {color:"black" , type:"king"}
                    }
                }
                return newBoard
            })
        }
        // check game end 
        var flagWhite = hasMove('white', newBoard);
        var flagBlack = hasMove('black', newBoard);
        if(players != null && players.color == 'black' && !flagBlack && turn){
            setIsGameEnd("white win")
        }
        if(players != null && players.color == 'white' && !flagWhite && turn){
            setIsGameEnd("black win")
        }
    },[board,players,turn])
    useEffect(()=>{
        if(!isGameEnd) return
        socket.emit('gameend',isGameEnd)
        alert(isGameEnd)
    },[isGameEnd])
    useEffect(()=>{
        if(!gameEndMessage) return
        alert(gameEndMessage)
    },[gameEndMessage])
    return(
        <GameContext.Provider
            value={{
                board,
                selectSquareHandler,
                moveDTO,
                allChat,
                setAllChat
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

function useGame(){
    const context = useContext(GameContext)
    if(context === undefined){
        throw new Error("Game context is undefined")
    }
    return context
}

export {GameProvider , useGame}

