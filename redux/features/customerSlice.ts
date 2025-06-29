import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse } from "@/types/ApiResponse";
import { CustomerDto } from "@/types/customer";
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from "@/services/customerService";

type CustomerState = {
  customersData: CustomerDto[];
  loading: boolean;
  error: string | undefined;
};

const initialState: CustomerState = {
  customersData: [],
  loading: false,
  error: undefined,
};

export const getAllCustomersAPI = createAsyncThunk<
  ApiResponse<CustomerDto[]>,
  void,
  { rejectValue: { message: string; error: string } }
>("getAllCustomersAPI", async (_, { rejectWithValue }) => {
  try {
    const result = await getAllCustomers();
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to fetch customers",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const addCustomerAPI = createAsyncThunk<
  ApiResponse<CustomerDto>,
  CustomerDto,
  { rejectValue: { message: string; error: string } }
>("addCustomerAPI", async (newCustomer, { rejectWithValue }) => {
  try {
    const result = await addCustomer(newCustomer);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to add customer",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const updateCustomerAPI = createAsyncThunk<
  ApiResponse<CustomerDto>,
  CustomerDto,
  { rejectValue: { message: string; error: string } }
>("updateCustomerAPI", async (updatedCustomer, { rejectWithValue }) => {
  try {
    const result = await updateCustomer(updatedCustomer);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to update customer",
      error: error?.message ?? "Unknown error",
    });
  }
});

export const deleteCustomerAPI = createAsyncThunk<
  ApiResponse<string>,
  number,
  { rejectValue: { message: string; error: string } }
>("deleteCustomerAPI", async (id, { rejectWithValue }) => {
  try {
    const result = await deleteCustomer(id);
    return result;
  } catch (error: any) {
    return rejectWithValue({
      message: "Failed to delete customer",
      error: error?.message ?? "Unknown error",
    });
  }
});

const customerSlice = createSlice({
  name: "customerSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomersAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllCustomersAPI.fulfilled, (state, action: PayloadAction<ApiResponse<CustomerDto[]>>) => {
          state.loading = false;
          state.customersData = action.payload?.data ?? [];
          state.error = undefined;
        }
      )
      .addCase(getAllCustomersAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? undefined;
      })
      .addCase(addCustomerAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCustomerAPI.fulfilled, (state, action: PayloadAction<ApiResponse<CustomerDto>>) => {
        state.loading = false;
        if (action.payload.data) {
          state.customersData = [...state.customersData, action.payload.data];
        }
        state.error = undefined;
      })
      .addCase(addCustomerAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(updateCustomerAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomerAPI.fulfilled, (state, action: PayloadAction<ApiResponse<CustomerDto>>) => {
        state.loading = false;
        if (action.payload.data) {
          const { id } = action.payload.data;
          const index = id !== undefined ? state.customersData.findIndex((c) => c.id === id) : -1;
          if (index !== -1) {
            state.customersData[index] = action.payload.data;
          }
        }
        state.error = undefined;
      })
      .addCase(updateCustomerAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      .addCase(deleteCustomerAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomerAPI.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.customersData = state.customersData.filter((customer) => customer.id !== id);
        state.loading = false;
        state.error = undefined;
      })
      .addCase(deleteCustomerAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export default customerSlice.reducer;