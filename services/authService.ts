import { ApiConfig } from "@/types/ApiConfig";
import { LoginApiResponse, LoginRequestDto, LoginResponseDto } from "@/types/auth";
import ApiService from "./api/api-service";

export const loginUser = async (usercredentials: LoginRequestDto): Promise<LoginApiResponse> => {
    const apiObject: ApiConfig = {}
    apiObject.method = 'POST';
    apiObject.authentication = false;
    apiObject.prefix = 'auth';
    apiObject.endpoint = 'login';
    apiObject.body = usercredentials;
    return ApiService.callApi<LoginResponseDto>(apiObject);    
};