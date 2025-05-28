import { getAllSuppliers, addSupplier } from "@/services/supplierService";
import { ApiResponse } from "@/types/ApiResponse";
import { SupplierDto } from "@/types/supplier";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { string } from "yup";

type SupplierState = {
  suppliersData: SupplierDto[];
  loading: boolean;
  error: string | undefined;
};

const initialState: SupplierState = {
  suppliersData: [],
  loading: false,
  error: undefined,
};

// Get All Suppliers
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

//Add New Suppliers
export const addSupplierAPI = createAsyncThunk<
  ApiResponse<SupplierDto>,
  SupplierDto,
  {
    rejectValue: {
      message: string;
      error: string;
    };
  }
>("addSupplierAPI", async (newSupplier, { rejectWithValue }) => {
  try {
    const result = await addSupplier(newSupplier);
    console.log("new Supplier Add Response", result);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to Add suppliers",
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
      .addCase(
        getAllSuppliersAPI.fulfilled,
        (state, action: PayloadAction<ApiResponse<SupplierDto[]>>) => {
          state.loading = false;
          state.suppliersData = action.payload?.data ?? [];
          state.error = undefined;
        }
      )
      .addCase(getAllSuppliersAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.error ?? undefined;
      })

      .addCase(addSupplierAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addSupplierAPI.fulfilled,
        (state, action: PayloadAction<ApiResponse<SupplierDto>>) => {
          state.loading = false;
          // state.suppliersData = action.payload.data ?? null;
          if (action.payload.data) {
            state.suppliersData = state.suppliersData
              ? [...state.suppliersData, action.payload.data]
              : [action.payload.data];
          }
          state.error = undefined;
        }
      )
      .addCase(addSupplierAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.error;
      });
  },
});

export const { resetData } = supplierSlice.actions;
export default supplierSlice.reducer;
