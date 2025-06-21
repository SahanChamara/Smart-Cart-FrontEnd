import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import { SupplierDto } from "@/types/supplier";
import ApiService from "./api/api-service";

export const getAllSuppliers = (): Promise<
  ApiResponse<SupplierDto[]>
> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.prefix = "supplier";
  apiObject.endpoint = "";
  apiObject.body = null;
  return ApiService.callApi<SupplierDto[]>(apiObject);
};

export const addSupplier = (
  newSupplier: SupplierDto
): Promise<ApiResponse<SupplierDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.prefix = "supplier";
  apiObject.endpoint = "";
  apiObject.body = newSupplier;
  return ApiService.callApi<SupplierDto>(apiObject);
};

export const updateSupplier = (updatedSupplier: SupplierDto): Promise<ApiResponse<SupplierDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = 'PUT';
  apiObject.authentication = true;
  apiObject.prefix = "supplier";
  apiObject.endpoint = `${updatedSupplier.id}`;
  apiObject.body = updatedSupplier;
  return ApiService.callApi<SupplierDto>(apiObject);
}

export const deleteSupplier = (supplierId: number): Promise<ApiResponse<Object>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "DELETE";
  apiObject.authentication = true;
  apiObject.prefix = "supplier";
  apiObject.endpoint = `${supplierId}`;
  apiObject.body = null;
  return ApiService.callApi<Object>(apiObject);
}