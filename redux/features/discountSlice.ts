import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "@/types/ApiResponse";
import { DiscountDto, Product } from "@/types/discount";
import { getAllDiscounts, getAllProductsForDiscount, addDiscount, updateDiscount, deleteDiscount } from "@/services/discountService";

type DiscountState = {
  discountsData: DiscountDto[];
  productsData: Product[];
  loading: {
    discounts: boolean;
    products: boolean;
  };
  error: {
    discounts: string | null;
    products: string | null;
  };
};

const initialState: DiscountState = {
  discountsData: [],
  productsData: [],
  loading: { discounts: false, products: false },
  error: { discounts: null, products: null },
};

export const getAllDiscountsAPI = createAsyncThunk<
  ApiResponse<DiscountDto[]>,
  void,
  { rejectValue: { message: string; error: string } }
>("getAllDiscountsAPI", async (_, { rejectWithValue }) => {
  try {
    const result = await getAllDiscounts();
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to fetch discounts",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const getAllProductsForDiscountAPI = createAsyncThunk<
  ApiResponse<Product[]>,
  void,
  { rejectValue: { message: string; error: string } }
>("getAllProductsForDiscountAPI", async (_, { rejectWithValue }) => {
  try {
    const result = await getAllProductsForDiscount();
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to fetch products",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const addDiscountAPI = createAsyncThunk<
  ApiResponse<DiscountDto>,
  DiscountDto,
  { rejectValue: { message: string; error: string } }
>("addDiscountAPI", async (newDiscount, { rejectWithValue }) => {
  try {
    const result = await addDiscount(newDiscount);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to add discount",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const updateDiscountAPI = createAsyncThunk<
  ApiResponse<DiscountDto>,
  DiscountDto,
  { rejectValue: { message: string; error: string } }
>("updateDiscountAPI", async (updatedDiscount, { rejectWithValue }) => {
  try {
    const result = await updateDiscount(updatedDiscount);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to update discount",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const deleteDiscountAPI = createAsyncThunk<
  ApiResponse<string>,
  number,
  { rejectValue: { message: string; error: string } }
>("deleteDiscountAPI", async (id, { rejectWithValue }) => {
  try {
    const result = await deleteDiscount(id);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to delete discount",
      error: error?.message ?? "Unknown error",
    });
  }
});

const discountSlice = createSlice({
  name: "discountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDiscountsAPI.pending, (state) => {
        state.loading.discounts = true;
        state.error.discounts = null;
      })
      .addCase(getAllDiscountsAPI.fulfilled, (state, action: PayloadAction<ApiResponse<DiscountDto[]>>) => {
        state.loading.discounts = false;
        state.discountsData = action.payload?.data ?? [];
        state.error.discounts = null;
      })
      .addCase(getAllDiscountsAPI.rejected, (state, action) => {
        state.loading.discounts = false;
        state.error.discounts = action.payload?.error ?? "Failed to fetch discounts";
      })
      .addCase(getAllProductsForDiscountAPI.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(getAllProductsForDiscountAPI.fulfilled, (state, action: PayloadAction<ApiResponse<Product[]>>) => {
        state.loading.products = false;
        state.productsData = action.payload?.data ?? [];
        state.error.products = null;
      })
      .addCase(getAllProductsForDiscountAPI.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.payload?.error ?? "Failed to fetch products";
      })
      .addCase(addDiscountAPI.pending, (state) => {
        state.loading.discounts = true;
      })
      .addCase(addDiscountAPI.fulfilled, (state, action: PayloadAction<ApiResponse<DiscountDto>>) => {
        state.loading.discounts = false;
        if (action.payload.data) {
          state.discountsData = [...state.discountsData, action.payload.data];
        }
        state.error.discounts = null;
      })
      .addCase(addDiscountAPI.rejected, (state, action) => {
        state.loading.discounts = false;
        state.error.discounts = action.payload?.error ?? null;
      })
      .addCase(updateDiscountAPI.pending, (state) => {
        state.loading.discounts = true;
      })
      .addCase(updateDiscountAPI.fulfilled, (state, action: PayloadAction<ApiResponse<DiscountDto>>) => {
        state.loading.discounts = false;
        if (action.payload.data) {
          const { id } = action.payload.data;
          const index = id !== undefined ? state.discountsData.findIndex((d) => d.id === id) : -1;
          if (index !== -1) {
            state.discountsData[index] = action.payload.data;
          }
        }
        state.error.discounts = null;
      })
      .addCase(updateDiscountAPI.rejected, (state, action) => {
        state.loading.discounts = false;
        state.error.discounts = action.payload?.error ?? null;
      })
      .addCase(deleteDiscountAPI.pending, (state) => {
        state.loading.discounts = true;
      })
      .addCase(deleteDiscountAPI.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.discountsData = state.discountsData.filter((discount) => discount.id !== id);
        state.loading.discounts = false;
        state.error.discounts = null;
      })
      .addCase(deleteDiscountAPI.rejected, (state, action) => {
        state.loading.discounts = false;
        state.error.discounts = action.payload?.error ?? null;
      });
  },
});

export default discountSlice.reducer;