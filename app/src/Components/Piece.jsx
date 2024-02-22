import KingSymbol from "./KingSymbol"

export default function Piece({color , type}){
    var class_ = "piece-circle "
    if(color == 'white') class_ += "white-piece"
    if(color == 'black') class_ += "black-piece"

    return(
        <div className={class_}>
            {type =="king" && <KingSymbol/>}
        </div>
    )

}