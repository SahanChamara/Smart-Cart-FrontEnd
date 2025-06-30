import { addInventory } from "@/services/inventoryService";
import { ApiResponse } from "@/types/ApiResponse";
import { InventoryLogDto } from "@/types/inventory"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InventoryLogState = {
    inventoryData: InventoryLogDto[];
    loading: boolean;
    error: string | undefined;
};

const initialState: InventoryLogState = {
    inventoryData: [],
    loading: false,
    error: undefined,
};

// Async Thunk
export const addInventoryLogAPI = createAsyncThunk<ApiResponse<InventoryLogDto>, InventoryLogDto, {
    rejectValue: {
        message: string;
        error: string;
    };
}>(
    "addInventoryLogAPI",
    async (newInventoryLog, { rejectWithValue }) => {
        try {
            const response = await addInventory(newInventoryLog);
            console.log("Add Inventory Response", response);
            return response;
        } catch (error: any) {
            return rejectWithValue({
                message: "Failed Add New Inventory Log",
                error: error?.message ?? "Unknown Error",
            });
        }
    });

const InventorySlice = createSlice({
    name: "inventorySlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addInventoryLogAPI.pending, (state) => {
                state.loading = true;
            })
            .addCase(addInventoryLogAPI.fulfilled, (state, action: PayloadAction<ApiResponse<InventoryLogDto>>) => {
                state.loading = false;
                if (action.payload.data !== undefined) {
                    state.inventoryData = [...state.inventoryData, action.payload.data];
                }
                state.error = undefined;
            })
            .addCase(addInventoryLogAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error;
            })
    }
});

export default InventorySlice.reducer;