export const BASE_URL = "http://localhost:5165/api"
export const METADATA_API_SETTINGS = (method: string, data?: object | null, token?: string) => {
   const Metadata: RequestInit = {}

   Metadata.method = method ?? "GET";
   Metadata.headers = {
        'Accept' : 'text/plain',
        'Content-Type' : 'application/json',
   } as HeadersInit

   if(token) {
    Metadata.headers = {
        ...Metadata.headers,
        'Authorization' : `Bearer ${token}`
    } as HeadersInit
   }

   if(data) {
    Metadata.body = JSON.stringify(data)
   }

   return Metadata;
}

export interface Users {
    name: string,
    email: string,
    is_active: boolean,
    role_id: number
}