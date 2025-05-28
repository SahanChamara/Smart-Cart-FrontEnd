import axiosApiClient from "@/config/axios-config";
import { ApiConfig } from "@/types/ApiConfig";
import { ApiResponse } from "@/types/ApiResponse";
import * as constant from '@/config/constants';
import apiConfig from "@/config/api-config";

class ApiService {
    static async callApi<T = any>(apiObject: ApiConfig): Promise<ApiResponse<T>> {
        let body = {};
        const method = apiObject.method ? apiObject.method.toLowerCase() : 'get';

        if (method === 'post' || method === 'put' || method === 'patch') {
            body = apiObject.body ?? {};
        }

        const headers: Record<string, string> = {
            'content-Type': apiObject.urlencoded
                ? 'application/x-www.-form-urlencoded'
                : apiObject.multipart
                    ? 'multipart/form-data'
                    : 'application/json'
        }

        if (apiObject.authentication) {
            const token = localStorage.getItem(constant.ACCESS_TOKEN);
            if (token) {
                headers['Authorization'] = `Bearer ${token};`
            }
        }

        const serverUrl = apiConfig.serverUrl;
        let basePath = apiConfig.basePath;

        if (apiObject.basePath) {
            basePath = apiObject.basePath;
        }

        const prefix = apiObject.prefix;
        let url = "";
        
        if(apiObject.endpoint == ""){
            url = `${serverUrl}/${basePath}${prefix ? '/' + prefix : ''}`;
        }else{
            url = `${serverUrl}/${basePath}${prefix ? '/' + prefix : ''}/${apiObject.endpoint}`;
        }

        try {
            const response = await axiosApiClient({
                method,
                url,
                data: method !== 'get' && method !== 'delete' ? body : undefined,
                headers
            });

            return {
                ...response.data,
                desc: response.data.desc ?? response.data.result,
                status: response?.status || 0
            };
        } catch (error: any) {
            if (!error.response) {
                return {
                    success: false,
                    status: 2,
                    result: "Your Connection was interrupted",
                    data: undefined,
                };
            }

            if (error.response.status === 401) {
                if (apiObject.type !== "AUTH") {
                    localStorage.removeItem(constant.ACCESS_TOKEN);
                }
                return {
                    success: false,
                    status: 2,
                    result: "Your session expired or invalid Credentials! Please Login again...",
                    data: undefined,
                }
            }
            if (error.response.status === 403) {
                return {
                    success: false,
                    status: 2,
                    result: "Access is denied.",
                    data: undefined
                };
            }

            if (error.response.status === 417) {
                return {
                    success: false,
                    status: 2,
                    result: "Oops! Something went wrong.",
                    data: undefined
                };
            }

            if (error.response.data) {
                return {
                    success: false,
                    status: 0,
                    result: error.response.data.result ?? 'Sorry, something went wrong',
                    data: undefined
                };
            }

            return {
                success: false,
                status: 2,
                result: "Sorry, something went wrong.",
                data: undefined
            };
        }
    }


}

export default ApiService;