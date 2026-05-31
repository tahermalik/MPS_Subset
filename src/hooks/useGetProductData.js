import axios from "axios";
import { useEffect, useState } from "react";
import { PRODUCT_ENDPOINTS } from "../pages/endpoints";
import toast from "react-hot-toast";
import { setProductId } from "../redux/slices/productSlice";
import { useSelector,useDispatch } from "react-redux";


export function useGetProductData(productId=""){
    const [productData,setProductData]=useState({})
    const dispatch=useDispatch()

    const reduxProductId=useSelector((state)=>state?.product?.productId)
    
    productId= productId === "" ? reduxProductId: productId;

    // console.log("inside custom hook",productId)

    useEffect(()=>{
        async function fetchProductData(){
            try{
                // console.log("calling the function")
                const url=`${PRODUCT_ENDPOINTS}/singleProductDisplay/${productId}`
                // console.log("url",url)

                const res=await axios.post(url,{withCredentials:true})
                // console.log(res)

                setProductData(res?.data?.productData)
            }catch(error){
                console.log("wrong in fetching the productData")
                toast.error("wrong in fetching the productData")
            }
        }
        fetchProductData()
        // console.log("function called 1")

    },[productId])

    // console.log("After useEffect")

    return productData
} 