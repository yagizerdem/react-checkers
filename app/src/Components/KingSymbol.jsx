import imgsrc from '../assets/king.png'
export default function KingSymbol(){

    return(
        <span className="king-symbol">
            <img src={imgsrc} alt="K" className="king-png" />
        </span>
    )
}