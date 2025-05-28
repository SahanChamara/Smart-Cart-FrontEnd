import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import { SupplierDto } from "@/types/supplier";
import ApiService from "./api/api-service";

export const getAllSuppliers = async ():Promise<ApiResponse<SupplierDto>> => {
    const apiObject:ApiConfig = {};
    apiObject.method = 'GET';
    apiObject.authentication  = false;
    apiObject.prefix = "supplier";
    apiObject.endpoint = "";
    apiObject.body = null;
    return ApiService.callApi<SupplierDto>(apiObject);
};