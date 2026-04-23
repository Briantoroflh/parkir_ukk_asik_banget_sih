import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface GateCreateDto {
    zone_id: number
    name: string
    gate_type: string
    location_desc?: string
}

export interface GateUpdateDto {
    zone_id: number
    name: string
    gate_type: string
    location_desc?: string
    is_active: boolean
}

// ============ Response Types ============
export interface Gate {
    id: number
    created_by: string
    zone_id: number
    name: string
    gate_type: string
    location_desc: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface GetAllGateResponse {
    status: boolean
    message: string
    data?: Gate[]
    errors?: Object
    error_detail?: string
}

export interface CreateGateResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateGateResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteGateResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class GateService {
    async GetAllGate(): Promise<GetAllGateResponse> {
        try {
            const token = Cookies.get('accessToken')

            const gateRequest = await fetch(
                `${BASE_URL}/gate/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await gateRequest.json()
            console.log('GetAllGate Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data gate'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetAllGate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreGate(dto: GateCreateDto): Promise<CreateGateResponse> {
        try {
            if (!dto.zone_id || dto.zone_id <= 0) {
                return {
                    status: false,
                    message: 'Zone ID tidak boleh kosong!'
                }
            }

            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Nama gate tidak boleh kosong!'
                }
            }

            if (!dto.gate_type || dto.gate_type.trim() === '') {
                return {
                    status: false,
                    message: 'Tipe gate tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const createGateRequest = await fetch(
                `${BASE_URL}/gate/create-gate`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        zone_id: dto.zone_id,
                        name: dto.name.trim(),
                        gate_type: dto.gate_type.trim(),
                        location_desc: dto.location_desc || '',
                    },
                    token
                )
            )

            const res = await createGateRequest.json()
            console.log('StoreGate Response:', res)

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
            console.error('StoreGate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateGate(id: number, dto: GateUpdateDto): Promise<UpdateGateResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID gate tidak valid!'
                }
            }

            if (!dto.zone_id || dto.zone_id <= 0) {
                return {
                    status: false,
                    message: 'Zone ID tidak boleh kosong!'
                }
            }

            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Nama gate tidak boleh kosong!'
                }
            }

            if (!dto.gate_type || dto.gate_type.trim() === '') {
                return {
                    status: false,
                    message: 'Tipe gate tidak boleh kosong!'
                }
            }

            if (dto.is_active === undefined) {
                return {
                    status: false,
                    message: 'Status gate tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const updateGateRequest = await fetch(
                `${BASE_URL}/gate/update-gate/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        zone_id: dto.zone_id,
                        name: dto.name.trim(),
                        gate_type: dto.gate_type.trim(),
                        location_desc: dto.location_desc || '',
                        is_active: dto.is_active
                    },
                    token
                )
            )

            const res = await updateGateRequest.json()
            console.log('UpdateGate Response:', res)

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
            console.error('UpdateGate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteGate(id: number): Promise<DeleteGateResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID gate tidak valid!'
                }
            }

            const token = Cookies.get('accessToken')

            const deleteGateRequest = await fetch(
                `${BASE_URL}/gate/delete-gate/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await deleteGateRequest.json()
            console.log('DeleteGate Response:', res)

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
            console.error('DeleteGate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new GateService()