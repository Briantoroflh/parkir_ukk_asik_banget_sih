import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

interface LoginDto {
    email: string,
    password: string
}

interface LoginResponse {
    status: boolean,
    message: string,
    token?: string,
    refreshToken?: string
    user?: any,
    data?: any,
    errors?: Object
}

export interface RefreshTokenResponse{
    status: boolean,
    message: string,
    user_id?: number,
    accessToken?: string,
    refreshToken?: string
}

interface LogoutResponse {
    status: boolean,
    message: string,
    data?: any,
    errors?: Object
}

class AuthService {
    async Login(cred: LoginDto): Promise<LoginResponse> {
        try{
            const postLogin = await fetch(`${BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    'Accept' : 'text/plain',
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    email: cred.email,
                    password: cred.password
                })
            })

            const res = await postLogin.json();

            if(!res.ok) {
                const data: LoginResponse = {
                    status: res.status,
                    message: res.message
                }
            }

           Cookies.set("accessToken", res.accessToken, {
                expires: 1 / 24,
                secure: true,
                sameSite: 'Strict'
            })

            Cookies.set("refreshToken", res.refreshToken, {
                expires: 7, 
                secure: true,
                sameSite: 'Strict'
            })

            const data: LoginResponse = {
                status: res.status,
                message: res.message,
                data: res.data,
                token: res.accessToken,
                refreshToken: res.refreshToken
            }

            return data;
        }catch(err: unknown) {
            console.log(err)
            
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
            
            const error: LoginResponse = {
                status: false,
                message: errorMessage
            }

            return error
        }
    }

    async RefreshToken(): Promise<RefreshTokenResponse> {
        try {
            const refreshToken = Cookies.get('refreshToken');

            if (!refreshToken) {
                return {
                    status: false,
                    message: 'No refresh token found'
                }
            }

            const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            })

            const res = await response.json();

            if (!res.status && response.status === 401) {
                // Refresh token expired, clear cookies dan redirect ke login
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                return {
                    status: false,
                    message: 'Refresh token expired'
                }
            }

            // Simpan token baru
            Cookies.set("accessToken", res.accessToken, {
                expires: 1 / 24,  // 2 jam
                secure: true,
                sameSite: 'Strict'
            })

            Cookies.set("refreshToken", res.refreshToken, {
                expires: 7,  // 7 hari
                secure: true,
                sameSite: 'Strict'
            })

            return {
                status: true,
                message: 'Token refreshed successfully',
                accessToken: res.accessToken,
                refreshToken: res.refreshToken
            }
        }catch(err: unknown) {
            console.log(err)

            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage
            }
        }
    }

    async Logout(): Promise<LogoutResponse> {
        try {
            const token = Cookies.get('accessToken')

            const postLogout = await fetch(`${BASE_URL}/users/logout`, 
                METADATA_API_SETTINGS('POST', null, token)
            )

            const res = await postLogout.json();

            console.log(res);

            if (!res.status) {
                const data: LogoutResponse = {
                    status: res.status,
                    message: res.message,
                    errors: res.errors
                }
                return data
            }

            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')

            const data: LogoutResponse = {
                status: res.status,
                message: res.message,
                data: res.data
            }

            return data
        } catch (err: unknown) {
            console.log(err)

            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            const error: LogoutResponse = {
                status: false,
                message: errorMessage
            }

            return error
        }
    }
}

export const authService = new AuthService();