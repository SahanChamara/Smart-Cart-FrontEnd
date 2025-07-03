import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import { InventoryLogDto } from "@/types/inventory";
import ApiService from "./api/api-service";

export const addInventory = async (newInventoryLog: InventoryLogDto): Promise<ApiResponse<InventoryLogDto>> => {
    const apiObject: ApiConfig = {
        method: "POST",
        authentication: true,
        prefix: "inventory-log",
        endpoint: "",
        body: newInventoryLog,
    }
    return ApiService.callApi<InventoryLogDto>(apiObject);
};