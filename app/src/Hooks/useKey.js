import { useEffect } from "react";

export default function useKey(userKey , callback){
    useEffect(()=>{
        document.addEventListener('keydown' , (e)=>executeCallback(e))
        function executeCallback({key , code}){
            if(userKey === key){
                callback()
            }
        }
        return(
            ()=> document.removeEventListener('keydown',executeCallback)
        )
    },[userKey ,callback])
}