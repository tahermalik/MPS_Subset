import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    productId:"",productBrandName:""
  },
  reducers: {
    setBrandName:(state,action)=>{
        state.productBrandName=action.payload
    },
    setProductId:(state,action)=>{
        state.productId=action.payload
    }
  }
})

export const {setBrandName,setProductId} = productSlice.actions;
export default productSlice.reducer;