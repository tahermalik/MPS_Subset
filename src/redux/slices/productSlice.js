import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    originalPrices:[],discounts:[],images:[],netQuantity:[],productName:null,manufacturerDetails:null,productDescription:null,completeProductInfo:null,productId:""
  },
  reducers: {
    setOriginalPrice:(state,action)=>{
        state.originalPrices.includes(action.payload)
    },
    setDiscount:(state,action)=>{
        state.discounts.includes(action.payload)
    },
    setImage:(state,action)=>{
        state.images.includes(action.payload)
    },
    setNetQuantity:(state,action)=>{
        state.netQuantity.includes(action.payload)
    },
    setProductName:(state,action)=>{
        state.productName.includes(action.payload)
    },
    setManufacturerDetails:(state,action)=>{
        state.manufacturerDetails.includes(action.payload)
    },
    setProductDescription:(state,action)=>{
        state.productDescription.includes(action.payload)
    },
    setCompleteProductInfo:(state,action)=>{
        state.completeProductInfo=action.payload
    },
    setProductId:(state,action)=>{
        state.productId=action.payload
    }
  }
})

export const { setOriginalPrice,setDiscount,setImage,setProductName,setNetQuantity,setManufacturerDetails,setProductDescription,setCompleteProductInfo,setProductId} = productSlice.actions;
export default productSlice.reducer;