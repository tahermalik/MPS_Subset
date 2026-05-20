import axios from "axios";
import { useEffect, useState } from "react";
import { PRODUCT_ENDPOINTS } from "../pages/endpoints";
import toast from "react-hot-toast";

export function useGetProductData(productId){
    const [productData,setProductData]=useState({})

    useEffect(()=>{
        async function fetchProductData(){
            try{
                const url=`${PRODUCT_ENDPOINTS}/singleProductDisplay/${productId}`
                console.log(url)

                const res=await axios.post(url,{withCredentials:true})
                console.log(res)
                setProductData(res?.data?.productData)
            }catch(error){
                console.log("wrong in fetching the productData")
                toast.error("wrong in fetching the productData")
            }
        }
        fetchProductData()

    },[productId])

    return productData
} 