import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { SERVER_URL } from "./constants";
import { headers } from 'next/headers';
import { UserDto } from '@/types/auth';
import { store } from '@/redux/store';
import { logout } from '@/redux/features/authSlice';
import Swal from 'sweetalert2';

const API_BASE_URL = SERVER_URL;

declare module 'axios' {
    interface AxiosRequestConfig {
        _retry?: boolean;

    }
}

interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
}

interface ErrorResponse {
    message: string;
    statusCode: number;
    timestamp?: string;
    path: string;
}

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

//Request Interceptor


//Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },

    async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;

        // 401 Unauthorized 
        /* if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshTokenValue = store.getState().auth.refreshToken;
                const response = await axios.post<{ token: string, user: UserDto }>(
                    `${API_BASE_URL}/api/auth/refresh`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${refreshTokenValue}`
                        }
                    }
                );

                store.dispatch(refreshToken({
                    token: response.data.token,
                    user: response.data.user,
                }));

                //Retry Original Request with new token
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${response.data.token}`
                };
                return apiClient(originalRequest);
            } catch (refreshError) {
                // if refresh token failed..logout user
                store.dispatch(logout());
                await Swal.fire({
                    title: "Session Expired",
                    text: "Your session has expired. Please log in again",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                });
                window.location.href = '/login';
                return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
            }
        } */

        // Handle 403 Foridden (role-based access)
        if (status === 403) {
            await Swal.fire({
                title: "Access Denied",
                text: "You don't have permission to access this resource.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return Promise.reject(error);
        }

        // Handle other errors
        if (status && status >= 500) {
            await Swal.fire({
                title: "Server Error",
                text: "Something went wrong on our end. Please try again later.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
        return Promise.reject(error);
    }
);

export default apiClient;

