import axios from "axios";
import { useEffect, useState } from "react";
import { USER_ENDPOINTS } from "../pages/endpoints.js";

export function useGetAllFeedBack(feedBackRefresh){
    const [feedBackData,setFeedBackData]=useState([])
    useEffect(()=>{
        async function getAllFeedBack(){
            // console.log("calliing for feedback from the basic app")
            const res=await axios.get(`${USER_ENDPOINTS}/displayFeedBack`)
            setFeedBackData(res?.data?.feedBackData)
            // console.log("hola",res)
        }
        getAllFeedBack();

    },[feedBackRefresh])
    return feedBackData
}