import { configureStore, UnknownAction } from "@reduxjs/toolkit"
import authSlice from "@/redux/features/authSlice";
import supplierSlice from "@/redux/features/supplierSlice"
import productSlice from "./features/productSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    supplier: supplierSlice,
    product: productSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type ProductSliceState = ReturnType<typeof productSlice>



