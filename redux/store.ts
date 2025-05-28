import { configureStore } from "@reduxjs/toolkit"
import authSlice from "@/redux/features/authSlice";
import supplierSlice from "@/redux/features/supplierSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    supplier: supplierSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
