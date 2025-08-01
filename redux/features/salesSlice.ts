import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "@/types/ApiResponse";
import { SaleDto, SaleItemDto } from "@/types/sale";
import { getAllSales, createSale, createSaleItem, updateSale, deleteSale } from "@/services/salesService";

type SalesState = {
  salesData: SaleDto[];
  loading: boolean;
  error: string | undefined;
};

const initialState: SalesState = {
  salesData: [],
  loading: false,
  error: undefined,
};

export const getAllSalesAPI = createAsyncThunk<
  ApiResponse<SaleDto[]>,
  void,
  { rejectValue: { message: string; error: string } }
>("getAllSalesAPI", async (_, { rejectWithValue }) => {
  try {
    const result = await getAllSales();
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to fetch sales",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const createSaleAPI = createAsyncThunk<
  ApiResponse<SaleDto>,
  SaleDto,
  { rejectValue: { message: string; error: string } }
>("createSaleAPI", async (newSale, { rejectWithValue }) => {
  try {
    const result = await createSale(newSale);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to create sale",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const createSaleItemAPI = createAsyncThunk<
  ApiResponse<SaleItemDto>,
  SaleItemDto,
  { rejectValue: { message: string; error: string } }
>("createSaleItemAPI", async (newSaleItem, { rejectWithValue }) => {
  try {
    const result = await createSaleItem(newSaleItem);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to create sale item",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const updateSaleAPI = createAsyncThunk<
  ApiResponse<SaleDto>,
  SaleDto,
  { rejectValue: { message: string; error: string } }
>("updateSaleAPI", async (updatedSale, { rejectWithValue }) => {
  try {
    const result = await updateSale(updatedSale);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to update sale",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const deleteSaleAPI = createAsyncThunk<
  ApiResponse<string>,
  number,
  { rejectValue: { message: string; error: string } }
>("deleteSaleAPI", async (id, { rejectWithValue }) => {
  try {
    const result = await deleteSale(id);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to delete sale",
      error: error?.message ?? "Unknown error",
    });
  }
});

const salesSlice = createSlice({
  name: "salesSlice",
  initialState,
  reducers: {
    resetData: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSalesAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSalesAPI.fulfilled, (state, action: PayloadAction<ApiResponse<SaleDto[]>>) => {
        state.loading = false;
        state.salesData = action.payload?.data ?? [];
        state.error = undefined;
      })
      .addCase(getAllSalesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? undefined;
      })
      .addCase(createSaleAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSaleAPI.fulfilled, (state, action: PayloadAction<ApiResponse<SaleDto>>) => {
        state.loading = false;
        if (action.payload.data) {
          state.salesData = [...state.salesData, action.payload.data];
        }
        state.error = undefined;
      })
      .addCase(createSaleAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(createSaleItemAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSaleItemAPI.fulfilled, (state) => {
        state.loading = false;
        state.error = undefined;
      })
      .addCase(createSaleItemAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(updateSaleAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSaleAPI.fulfilled, (state, action: PayloadAction<ApiResponse<SaleDto>>) => {
        state.loading = false;
        if (action.payload.data !== undefined) {
          const index = state.salesData.findIndex((s) => s.id === action.payload.data!.id);
          if (index !== -1) {
            state.salesData[index] = action.payload.data!;
          }
        }
        state.error = undefined;
      })
      .addCase(updateSaleAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(deleteSaleAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSaleAPI.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.salesData = state.salesData.filter((sale) => sale.id !== id);
        state.loading = false;
        state.error = undefined;
      })
      .addCase(deleteSaleAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { resetData } = salesSlice.actions;
export default salesSlice.reducer;