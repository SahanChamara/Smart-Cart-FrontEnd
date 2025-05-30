import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/services/productService";
import { ApiResponse } from "@/types/ApiResponse";
import { ProductDto } from "@/types/product";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductState = {
  productsData: ProductDto[];
  loading: boolean;
  error: string | undefined;
};

const initialState: ProductState = {
  productsData: [],
  loading: false,
  error: undefined,
};

// Thunks
export const getAllProductsAPI = createAsyncThunk<
  ApiResponse<ProductDto[]>,
  void,
  {
    rejectValue: {
      message: string;
      error: string;
    };
  }
>("getAllProductsAPI", async (_, { rejectWithValue }) => {
  try {
    const result = await getAllProducts();
    console.log("Fetch All Products Response ->>> ", result);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to fetch products",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const addProductAPI = createAsyncThunk<
  ApiResponse<ProductDto>,
  ProductDto,
  {
    rejectValue: {
      message: string;
      error: string;
    };
  }
>("addProductAPI", async (newProduct, { rejectWithValue }) => {
  try {
    const result = await addProduct(newProduct);
    console.log("New Product Add Response ->>> ", result);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to add product",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const updateProductAPI = createAsyncThunk<
  ApiResponse<ProductDto>,
  ProductDto,
  {
    rejectValue: {
      message: string;
      error: string;
    };
  }
>("updateProductAPI", async (updatedProduct, { rejectWithValue }) => {
  try {
    const result = await updateProduct(updatedProduct);
    console.log("Update product response ->>> ", result);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to update product",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const deleteProductAPI = createAsyncThunk<
  ApiResponse<string>,
  number,
  {
    rejectValue: {
      message: string;
      error: string;
    };
  }
>("deleteProductAPI", async (id, { rejectWithValue }) => {
  try {
    const result = await deleteProduct(id);
    console.log("Delete product response ->>> ", result);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to delete product",
      error: error?.message ?? "Unknown error",
    });
  }
});

const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    resetData: (state) => { },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getAllProductsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllProductsAPI.fulfilled,
        (state, action: PayloadAction<ApiResponse<ProductDto[]>>) => {
          state.loading = false;
          state.productsData = action.payload?.data ?? [];
          state.error = undefined;
        }
      )
      .addCase(getAllProductsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? undefined;
      })

      // Add new product
      .addCase(addProductAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductAPI.fulfilled, (state, action: PayloadAction<ApiResponse<ProductDto>>) => {
        state.loading = false;
        if (action.payload.data) {
          state.productsData = [...state.productsData, action.payload.data];
        }
        state.error = undefined;
      })
      .addCase(addProductAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // Update product
      .addCase(updateProductAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductAPI.fulfilled, (state, action: PayloadAction<ApiResponse<ProductDto>>) => {
        state.loading = false;
        if (action.payload.data) {
          const { id } = action.payload.data;
          const index = id !== undefined ? state.productsData.findIndex(p => p.id === id) : -1;
          if (index !== -1) {
            state.productsData[index] = action.payload.data;
          }
        }
        state.error = undefined;
      })
      .addCase(updateProductAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // Delete product
      .addCase(deleteProductAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductAPI.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.productsData = state.productsData.filter(product => product.id !== id);
        state.loading = false;
        state.error = undefined;
      })
      .addCase(deleteProductAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { resetData } = productSlice.actions;
export default productSlice.reducer;