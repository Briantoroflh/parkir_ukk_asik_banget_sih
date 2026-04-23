import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface ZoneCreateDto {
    name: string
    description?: string
    additional_fee?: number
}

export interface ZoneUpdateDto {
    name: string
    description?: string
    additional_fee?: number
    is_active: boolean
}

// ============ Response Types ============
export interface Zone {
    id: number
    created_by: string
    name: string
    description: string
    capacity: number
    additional_fee: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface GetAllZoneResponse {
    status: boolean
    message: string
    data?: Zone[]
    errors?: Object
    error_detail?: string
}

export interface CreateZoneResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateZoneResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteZoneResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class ZoneService {
    async GetAllZone(): Promise<GetAllZoneResponse> {
        try {
            const token = Cookies.get('accessToken')

            const zoneRequest = await fetch(
                `${BASE_URL}/zone/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await zoneRequest.json()
            console.log('GetAllZone Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data zone'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetAllZone Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreZone(dto: ZoneCreateDto): Promise<CreateZoneResponse> {
        try {
            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Name tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const createZoneRequest = await fetch(
                `${BASE_URL}/zone/create-zone`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        name: dto.name.trim(),
                        description: dto.description || '',
                        additional_fee: dto.additional_fee || 0,
                    },
                    token
                )
            )

            const res = await createZoneRequest.json()
            console.log('StoreZone Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    errors: res.errors || null,
                    error_detail: res.error_detail || null
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('StoreZone Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateZone(id: number, dto: ZoneUpdateDto): Promise<UpdateZoneResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID zone tidak valid!'
                }
            }

            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Name tidak boleh kosong!'
                }
            }

            if (dto.is_active === undefined) {
                return {
                    status: false,
                    message: 'Is active tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const updateZoneRequest = await fetch(
                `${BASE_URL}/zone/update-zone/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        name: dto.name.trim(),
                        description: dto.description || '',
                        additional_fee: dto.additional_fee || 0,
                        is_active: dto.is_active
                    },
                    token
                )
            )

            const res = await updateZoneRequest.json()
            console.log('UpdateZone Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    errors: res.errors || null,
                    error_detail: res.error_detail || null
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('UpdateZone Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteZone(id: number): Promise<DeleteZoneResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID zone tidak valid!'
                }
            }

            const token = Cookies.get('accessToken')

            const deleteZoneRequest = await fetch(
                `${BASE_URL}/zone/delete-zone/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await deleteZoneRequest.json()
            console.log('DeleteZone Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    errors: res.errors || null,
                    error_detail: res.error_detail || null
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('DeleteZone Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new ZoneService()