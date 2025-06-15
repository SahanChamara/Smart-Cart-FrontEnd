import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import { CustomerDto } from "@/types/customer";
import ApiService from "./api/api-service";

export const getAllCustomers = async (): Promise<ApiResponse<CustomerDto[]>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.prefix = "customers";
  apiObject.endpoint = "";
  apiObject.body = null;
  return ApiService.callApi<CustomerDto[]>(apiObject);
};

export const addCustomer = async (newCustomer: CustomerDto): Promise<ApiResponse<CustomerDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.prefix = "customers";
  apiObject.endpoint = "";
  apiObject.body = newCustomer;
  return ApiService.callApi<CustomerDto>(apiObject);
};

export const updateCustomer = async (updatedCustomer: CustomerDto): Promise<ApiResponse<CustomerDto>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "PUT";
  apiObject.authentication = true;
  apiObject.prefix = "customers";
  apiObject.endpoint = `${updatedCustomer.id}`;
  apiObject.body = updatedCustomer;
  return ApiService.callApi<CustomerDto>(apiObject);
};

export const deleteCustomer = async (id: number): Promise<ApiResponse<string>> => {
  const apiObject: ApiConfig = {};
  apiObject.method = "DELETE";
  apiObject.authentication = true;
  apiObject.prefix = "customers";
  apiObject.endpoint = `${id}`;
  apiObject.body = null;
  return ApiService.callApi<string>(apiObject);
};