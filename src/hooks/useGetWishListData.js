import axios from "axios";
import { useEffect, useState } from "react";
import { PRODUCT_ENDPOINTS, USER_ENDPOINTS } from "../pages/endpoints";
import { useSelector, useDispatch } from "react-redux";
import { removeFavourite, removeMissingFromWishlist, replaceEntireWishList, setFavourite } from "../redux/slices/wishListSlice";
import toast from "react-hot-toast";
import store from "../redux/store";
import socket from "../../socket";

export default function useGetWishListData(userId, refresh) {
    // productData is an array of object
    const [productData, setProductData] = useState([])

    // simply an array of product variation
    const [productVariationData, setProductVaraitionData] = useState([])

    const dispatch = useDispatch()
    let wishListData = useSelector((state) => state?.wishList?.wishList);
    useEffect(() => {
        async function getWishListData() {
            try {
                const wishList_result = await axios.post(`${USER_ENDPOINTS}/viewWishList`, {}, { withCredentials: true })

                // simply fetch from the redux
                if (wishList_result?.data?.comment === "GUEST") {

                } else {  // data will come from redis if it is a hit otherwise from DB and populate redis
                    wishListData = wishList_result?.data?.wishListData
                    dispatch(replaceEntireWishList(wishListData))

                }

                if (!wishListData || wishListData.length === 0) {
                    setProductData([]);
                    setProductVaraitionData([]);
                    return;
                }

                const productIds = wishListData.map((item) => item["productId"])
                const productVariationArray = wishListData.map((item) => item["productVariation"])
                const result = await axios.post(`${PRODUCT_ENDPOINTS}/getProductsViaId`, { productIds: productIds, productVariationArray: productVariationArray })
                // console.log("missing :- ",result?.data?.missingIds)
                const missingIds = result?.data?.missingIds
                if (missingIds.length > 0) {
                    dispatch(removeMissingFromWishlist(missingIds));
                }
                setProductData(result?.data?.productData)
                setProductVaraitionData(productVariationArray)

                // console.log("product Data",result?.data?.productData)

            } catch (error) {
                console.log("error in custom hook wishList", error)
                toast.error(error?.response?.data?.message || "Something went wrong")
            }
        }



        // ✅ listen to server event
        socket.on("addWishList", (data) => {
            // data will be an object
            console.log("Received:", data);
            dispatch(setFavourite({"productId":data?._id,"productVariation":data?.productVariation}))
            setProductData((prev) => [...prev, data])
            setProductVaraitionData((prev) => [...prev, data?.productVariation])
        });

        socket.on("removeWishList", (data) => {
            // data will be an object
            const productId = data?.productId
            const productVariation = data?.productVariation

            console.log("To remove "+productId +" and "+productVariation)
            // dispatch(removeFavourite({productId,productVariation}))

            setProductData(prev=>prev.filter((d,idx)=> {
                if(d?._id.toString()===productId.toString() && d?.productVariation===productVariation){
                    return false
                }
                return true
            }))
        });

        getWishListData()

        // cleanup
        return () => {
            socket.off("addWishList");
        };

    }, [refresh, userId])
    return { productData};
}