import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface FeeConfigCreateDto {
    zone_id: number
    vehicle_type_id: number
    base_fee: number
    grace_period_minutes?: number
    effective_from: string
    effective_until?: string
}

export interface FeeConfigUpdateDto {
    zone_id: number
    vehicle_type_id: number
    base_fee: number
    grace_period_minutes?: number
    is_active: boolean
    effective_from: string
    effective_until?: string
}

// ============ Response Types ============
export interface FeeConfig {
    id: number
    zone_id: number
    vehicle_type_id: number
    created_by: number
    base_fee: number
    grace_period_minutes: number
    is_active: boolean
    effective_from: string
    effective_until: string
    created_at: string
    updated_at: string
}

export interface GetAllFeeConfigResponse {
    status: boolean
    message: string
    data?: FeeConfig[]
    errors?: Object
    error_detail?: string
}

export interface CreateFeeConfigResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateFeeConfigResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteFeeConfigResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class FeeConfigService {
    async GetAllFeeConfig(): Promise<GetAllFeeConfigResponse> {
        try {
            const token = Cookies.get('accessToken')

            const feeConfigRequest = await fetch(
                `${BASE_URL}/fee-config/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await feeConfigRequest.json()
            console.log('GetAllFeeConfig Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data fee config'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetAllFeeConfig Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreFeeConfig(dto: FeeConfigCreateDto): Promise<CreateFeeConfigResponse> {
        try {
            if (!dto.zone_id || dto.zone_id <= 0) {
                return {
                    status: false,
                    message: 'Zone ID tidak boleh kosong!'
                }
            }

            if (!dto.vehicle_type_id || dto.vehicle_type_id <= 0) {
                return {
                    status: false,
                    message: 'Tipe kendaraan tidak boleh kosong!'
                }
            }

            if (!dto.base_fee || dto.base_fee <= 0) {
                return {
                    status: false,
                    message: 'Base fee harus lebih dari 0!'
                }
            }

            if (!dto.effective_from) {
                return {
                    status: false,
                    message: 'Tanggal efektif tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const createFeeConfigRequest = await fetch(
                `${BASE_URL}/fee-config/create-fee-config`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        zone_id: dto.zone_id,
                        vehicle_type_id: dto.vehicle_type_id,
                        base_fee: dto.base_fee,
                        grace_period_minutes: dto.grace_period_minutes || 0,
                        effective_from: dto.effective_from,
                        effective_until: dto.effective_until || null,
                    },
                    token
                )
            )

            const res = await createFeeConfigRequest.json()
            console.log('StoreFeeConfig Response:', res)

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
            console.error('StoreFeeConfig Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateFeeConfig(id: number, dto: FeeConfigUpdateDto): Promise<UpdateFeeConfigResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID fee config tidak valid!'
                }
            }

            if (!dto.zone_id || dto.zone_id <= 0) {
                return {
                    status: false,
                    message: 'Zone ID tidak boleh kosong!'
                }
            }

            if (!dto.vehicle_type_id || dto.vehicle_type_id <= 0) {
                return {
                    status: false,
                    message: 'Tipe kendaraan tidak boleh kosong!'
                }
            }

            if (!dto.base_fee || dto.base_fee <= 0) {
                return {
                    status: false,
                    message: 'Base fee harus lebih dari 0!'
                }
            }

            if (!dto.effective_from) {
                return {
                    status: false,
                    message: 'Tanggal efektif tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const updateFeeConfigRequest = await fetch(
                `${BASE_URL}/fee-config/update-fee-config/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        zone_id: dto.zone_id,
                        vehicle_type_id: dto.vehicle_type_id,
                        base_fee: dto.base_fee,
                        grace_period_minutes: dto.grace_period_minutes || 0,
                        is_active: dto.is_active,
                        effective_from: dto.effective_from,
                        effective_until: dto.effective_until || null,
                    },
                    token
                )
            )

            const res = await updateFeeConfigRequest.json()
            console.log('UpdateFeeConfig Response:', res)

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
            console.error('UpdateFeeConfig Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteFeeConfig(id: number): Promise<DeleteFeeConfigResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID fee config tidak valid!'
                }
            }

            const token = Cookies.get('accessToken')

            const deleteFeeConfigRequest = await fetch(
                `${BASE_URL}/fee-config/delete-fee-config/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await deleteFeeConfigRequest.json()
            console.log('DeleteFeeConfig Response:', res)

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
            console.error('DeleteFeeConfig Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new FeeConfigService()