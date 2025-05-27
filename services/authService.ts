import { ApiConfig } from "@/types/ApiConfig";
import { LoginRequestDto } from "@/types/auth";
import ApiService from "./api/api-service";

export const loginUser = async (usercredentials: LoginRequestDto) => {
    const apiObject: ApiConfig = {}
    apiObject.method = 'POST';
    apiObject.authentication = false;
    apiObject.prefix = 'auth';
    apiObject.endpoint = 'login';
    apiObject.body = usercredentials;
    return ApiService.callApi(apiObject);    
};