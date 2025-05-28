import { getAllSuppliers } from "@/services/supplierService";
import { ApiResponse } from "@/types/ApiResponse";
import { SupplierDto } from "@/types/supplier";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type SupplierState = {
  suppliersData: SupplierDto[] | null;
  loading: boolean;
  error: string | undefined;
};

const initialState: SupplierState = {
  suppliersData: [],
  loading: false,
  error: undefined,
};

export const getAllSuppliersAPI = createAsyncThunk<
  ApiResponse<SupplierDto[]>,
  void,
  {
    rejectValue: {
      message: string;
      error: string;
    };
  }
>("getAllSuppliersAPI", async (_, { rejectWithValue }) => {
  try {
    const result = await getAllSuppliers();
    console.log(result);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to fetch suppliers",
      error: error?.message ?? "Unknown error",
    });
  }
});

const supplierSlice = createSlice({
  name: "supplierSlice",
  initialState,
  reducers: {
    resetData: (state) => {},
  },
  extraReducers: (builder) => {
    builder
    .addCase(getAllSuppliersAPI.pending, (state) => {
      state.loading = true;
    })
    .addCase(getAllSuppliersAPI.fulfilled, (state, action: PayloadAction<ApiResponse<SupplierDto[]>>) => {
        state.loading = false;
        state.suppliersData = action.payload?.data ?? null;
        state.error = undefined;
    })
    .addCase(getAllSuppliersAPI.rejected, (state, action ) => {
        state.loading = true;
        state.error = action.payload?.error ?? undefined;        
    })
  },
});

export const { resetData } = supplierSlice.actions;
export default supplierSlice.reducer;
