export interface ApiConfig {
    method?: string;
    authentication?: boolean;
    prefix?: string;
    endpoint?: string;
    body?: any;
    urlencoded?: boolean;
    multipart?: boolean;
    basePath?: string;
    type?: string;
}