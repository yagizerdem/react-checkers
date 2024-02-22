import { useGame } from "../Context/GameConext";
import Square from "./Square";
import { useSocket } from "../Context/SocketContext";

export default function Board(){
    const {board} = useGame()
    const {players} = useSocket()

    var body = [];
    for(var i = 0 ; i < 8; i++){
        for(var j = 0 ; j < 8;j++){
            var class_ = "black"
            if((i +j) % 2 == 0) class_ ="white" 

            if(players.color == "black"){
                body.push(<Square className={class_} row={7-i} col={7-j} key={i *10 + j} piece={board[7-i][7-j]}></Square>)
                continue
            }
            body.push(<Square className={class_} row={i} col={j} key={i *10 + j} piece={board[i][j]}></Square>)
        }
    }

    return(
        <div className="board">
            {body.map((item)=>{
                return item
            })}
        </div>
    )
}