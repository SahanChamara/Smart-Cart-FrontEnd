import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import { DiscountDto } from "@/types/discount";
import { Product } from "@/types/discount";
import ApiService from "./api/api-service";

export const getAllDiscounts = async (): Promise<ApiResponse<DiscountDto[]>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.prefix = "discount";
  apiObject.endpoint = "";
  apiObject.body = null;
  return ApiService.callApi<DiscountDto[]>(apiObject);
};

export const getAllProductsForDiscount = async (): Promise<ApiResponse<Product[]>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.prefix = "product";
  apiObject.endpoint = "";
  apiObject.body = null;
  return ApiService.callApi<Product[]>(apiObject);
};

export const addDiscount = async (newDiscount: DiscountDto): Promise<ApiResponse<DiscountDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.prefix = "discount";
  apiObject.endpoint = "";
  apiObject.body = newDiscount;
  return ApiService.callApi<DiscountDto>(apiObject);
};

export const updateDiscount = async (updatedDiscount: DiscountDto): Promise<ApiResponse<DiscountDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "PUT";
  apiObject.authentication = true;
  apiObject.prefix = "discount";
  apiObject.endpoint = `${updatedDiscount.id}`;
  apiObject.body = updatedDiscount;
  return ApiService.callApi<DiscountDto>(apiObject);
};

export const deleteDiscount = async (id: number): Promise<ApiResponse<string>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "DELETE";
  apiObject.authentication = true;
  apiObject.prefix = "discount";
  apiObject.endpoint = `${id}`;
  apiObject.body = null;
  return ApiService.callApi<string>(apiObject);
};