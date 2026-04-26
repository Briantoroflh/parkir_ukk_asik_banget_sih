import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface RoleCreateDto {
    name: string
    description?: string
}

export interface RoleUpdateDto {
    name: string
    description?: string
}

// ============ Model ============
export interface Role {
    id: number
    name: string
    description: string
    created_by?: string
    created_at: string
    updated_at?: string
}

// ============ Response Type ============
export interface RoleResponse {
    status: boolean
    message: string
    data?: any // Bisa berupa Role[] atau ID hasil execute query
    errors?: any
    error_detail?: string
}

class RoleService {
    /**
     * 1. Mengambil semua data role
     * Endpoint: GET /api/role/get-all
     */
    async GetAllRole(): Promise<RoleResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/role/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            return await request.json()
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    /**
     * 2. Mengambil data role berdasarkan ID
     * Endpoint: GET /api/role/get-role/{id}
     */
    async GetRoleById(id: number): Promise<RoleResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID role tidak valid!'
                }
            }

            const request = await fetch(
                `${BASE_URL}/role/get-role/${id}`,
                METADATA_API_SETTINGS('GET')
            )

            return await request.json()
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    /**
     * 3. Menambahkan role baru
     * Endpoint: POST /api/role/create-role
     */
    async StoreRole(dto: RoleCreateDto): Promise<RoleResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/role/create-role`,
                METADATA_API_SETTINGS('POST', dto, token)
            )

            return await request.json()
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    /**
        * 4. Memperbarui data role
     * Endpoint: PUT /api/role/update-role/{id}
     */
    async UpdateRole(id: number, dto: RoleUpdateDto): Promise<RoleResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/role/update-role/${id}`,
                METADATA_API_SETTINGS('PUT', dto, token)
            )

            return await request.json()
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    /**
        * 5. Menghapus role (Hard Delete sesuai logic backend)
     * Endpoint: DELETE /api/role/delete-role/{id}
     */
    async DeleteRole(id: number): Promise<RoleResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/role/delete-role/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            return await request.json()
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    /**
     * Centralized Error Handler
     */
    private handleCatchError(err: unknown): RoleResponse {
        console.error('RoleService Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan pada koneksi network'
        return {
            status: false,
            message: errorMessage,
            error_detail: err instanceof Error ? err.stack : undefined
        }
    }
}

export default new RoleService()