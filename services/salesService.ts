import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import { SaleDto } from "@/types/sale";
import ApiService from "./api/api-service";

export const getAllSales = async (): Promise<ApiResponse<SaleDto[]>> => {
  const apiObject: ApiConfig = {
    method: "GET",
    authentication: true,
    prefix: "sale",
    endpoint: "",
    body: null,
  };
  return ApiService.callApi<SaleDto[]>(apiObject);
};

export const getSaleById = async (id: number): Promise<ApiResponse<SaleDto>> => {
  const apiObject: ApiConfig = {
    method: "GET",
    authentication: true,
    prefix: "sale",
    endpoint: `${id}`,
    body: null,
  };
  return ApiService.callApi<SaleDto>(apiObject);
};

export const createSale = async (newSale: SaleDto): Promise<ApiResponse<SaleDto>> => {
  const apiObject: ApiConfig = {
    method: "POST",
    authentication: true,
    prefix: "sale",
    endpoint: "",
    body: newSale,
  };
  return ApiService.callApi<SaleDto>(apiObject);
};

export const updateSale = async (updatedSale: SaleDto): Promise<ApiResponse<SaleDto>> => {
  const apiObject: ApiConfig = {
    method: "PUT",
    authentication: true,
    prefix: "sale",
    endpoint: `${updatedSale.id}`,
    body: updatedSale,
  };
  return ApiService.callApi<SaleDto>(apiObject);
};

export const deleteSale = async (id: number): Promise<ApiResponse<string>> => {
  const apiObject: ApiConfig = {
    method: "DELETE",
    authentication: true,
    prefix: "sale",
    endpoint: `${id}`,
    body: null,
  };
  return ApiService.callApi<string>(apiObject);
};