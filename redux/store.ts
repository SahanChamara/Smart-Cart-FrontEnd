import { configureStore, UnknownAction } from "@reduxjs/toolkit"
import authSlice from "@/redux/features/authSlice";
import supplierSlice from "@/redux/features/supplierSlice"
import productSlice from "./features/productSlice";
import customerSlice from "./features/customerSlice";
import inventorySlice from "./features/inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    supplier: supplierSlice,
    product: productSlice,
    customer: customerSlice,
    inventory: inventorySlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type ProductSliceState = ReturnType<typeof productSlice>
export type CustomerSliceState = ReturnType<typeof customerSlice>;