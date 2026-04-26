import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface GateDeviceCreateDto {
    gate_id: number
    device_type?: string
}

export interface GateDeviceUpdateDto {
    gate_id: number
    device_type?: string
    status: boolean
}

// ============ Response Types ============
export interface GateDevice {
    id: number
    gate_id: number
    uniqUrl: string
    device_type: string
    status: boolean
    created_at: string
    updated_at: string
}

export interface GateDeviceAds {
    id: number
    gate_device_id: number
    image: string
    title: string
    company: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface GateDeviceDetail {
    id: number
    gate_id: number
    uniqUrl: string
    device_type: string
    status: boolean
    gate_name: string
    created_at: string
    updated_at: string
}

export interface GateDeviceGrouped {
    device: GateDevice
    ads: GateDeviceAds[]
}

export interface GetAllGateDeviceResponse {
    status: boolean
    message: string
    data?: GateDevice[]
    errors?: Object
    error_detail?: string
}

export interface GetGateDeviceByUniqUrlResponse {
    status: boolean
    message: string
    data?: {
        device: GateDeviceDetail
        ads: GateDeviceAds[]
    }
    errors?: Object
    error_detail?: string
}

export interface CreateGateDeviceResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateGateDeviceResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteGateDeviceResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class GateDeviceService {
    async GetAllGateDevice(): Promise<GetAllGateDeviceResponse> {
        try {
            const token = Cookies.get('accessToken')

            const gateDeviceRequest = await fetch(
                `${BASE_URL}/gate-device/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await gateDeviceRequest.json()
            console.log('GetAllGateDevice Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data gate device'
                }
            }

            // Extract device array from grouped response
            // Response structure from backend: { device: GateDevice, ads: GateDeviceAds[] }[]
            const devices: GateDevice[] = (res.data || []).map((item: GateDeviceGrouped) => item.device)

            return {
                status: res.status,
                message: res.message,
                data: devices
            }
        } catch (err: unknown) {
            console.error('GetAllGateDevice Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async GetGateDeviceByUniqUrl(uniqUrl: string): Promise<GetGateDeviceByUniqUrlResponse> {
        try {
            if (!uniqUrl || uniqUrl.trim() === '') {
                return {
                    status: false,
                    message: 'uniqUrl tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const gateDeviceRequest = await fetch(
                `${BASE_URL}/gate-device/device/${uniqUrl}`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await gateDeviceRequest.json()
            console.log('GetGateDeviceByUniqUrl Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data gate device'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetGateDeviceByUniqUrl Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreGateDevice(dto: GateDeviceCreateDto): Promise<CreateGateDeviceResponse> {
        try {
            if (!dto.gate_id || dto.gate_id <= 0) {
                return {
                    status: false,
                    message: 'Gate ID tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const createGateDeviceRequest = await fetch(
                `${BASE_URL}/gate-device/create-gate-device`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        gate_id: dto.gate_id,
                        device_type: dto.device_type || '',
                    },
                    token
                )
            )

            const res = await createGateDeviceRequest.json()
            console.log('StoreGateDevice Response:', res)

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
            console.error('StoreGateDevice Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateGateDevice(id: number, dto: GateDeviceUpdateDto): Promise<UpdateGateDeviceResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID gate device tidak valid!'
                }
            }

            if (!dto.gate_id || dto.gate_id <= 0) {
                return {
                    status: false,
                    message: 'Gate ID tidak boleh kosong!'
                }
            }

            if (dto.status === undefined) {
                return {
                    status: false,
                    message: 'Status tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const updateGateDeviceRequest = await fetch(
                `${BASE_URL}/gate-device/update-gate-device/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        gate_id: dto.gate_id,
                        device_type: dto.device_type || '',
                        status: dto.status
                    },
                    token
                )
            )

            const res = await updateGateDeviceRequest.json()
            console.log('UpdateGateDevice Response:', res)

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
            console.error('UpdateGateDevice Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteGateDevice(id: number): Promise<DeleteGateDeviceResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID gate device tidak valid!'
                }
            }

            const token = Cookies.get('accessToken')

            const deleteGateDeviceRequest = await fetch(
                `${BASE_URL}/gate-device/delete-gate-device/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await deleteGateDeviceRequest.json()
            console.log('DeleteGateDevice Response:', res)

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
            console.error('DeleteGateDevice Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new GateDeviceService()