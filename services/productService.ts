import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import { ProductDto } from "@/types/product";
import ApiService from "./api/api-service";

export const getAllProducts = async (): Promise<ApiResponse<ProductDto[]>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.prefix = "product";
  apiObject.endpoint = "";
  apiObject.body = null;
  return ApiService.callApi<ProductDto[]>(apiObject);
};

export const getProductById = async (id: number): Promise<ApiResponse<ProductDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.prefix = "product";
  apiObject.endpoint = `${id}`;
  apiObject.body = null;
  return ApiService.callApi<ProductDto>(apiObject);
};

export const addProduct = async (newProduct: ProductDto): Promise<ApiResponse<ProductDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.prefix = "product";
  apiObject.endpoint = "";
  apiObject.body = newProduct;
  return ApiService.callApi<ProductDto>(apiObject);
};

export const updateProduct = async (updatedProduct: ProductDto): Promise<ApiResponse<ProductDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "PUT";
  apiObject.authentication = true;
  apiObject.prefix = "product";
  apiObject.endpoint = `${updatedProduct.id}`;
  apiObject.body = updatedProduct;
  return ApiService.callApi<ProductDto>(apiObject);
};

export const deleteProduct = async (id: number): Promise<ApiResponse<string>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "DELETE";
  apiObject.authentication = true;
  apiObject.prefix = "product";
  apiObject.endpoint = `${id}`;
  apiObject.body = null;
  return ApiService.callApi<string>(apiObject);
};