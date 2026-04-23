import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface HolidayRateCreateDto {
    name: string
    date_start: string
    date_aend?: string
    rate_type: string
    multiplier: number
    override_fee: number
    applies_to_zone_id: number
    applies_to_vehicle_type_id: number
}

export interface HolidayRateUpdateDto {
    name: string
    date_start: string
    date_aend?: string
    rate_type: string
    multiplier: number
    override_fee: number
    applies_to_zone_id: number
    applies_to_vehicle_type_id: number
}

// ============ Response Types ============
export interface HolidayRate {
    id: number
    created_by: string
    name: string
    date_start: string
    date_aend: string
    rate_type: string
    multiplier: number
    override_fee: number
    applies_to_zone_id: number
    applies_to_vehicle_type_id: number
    created_at: string
    updated_at: string
}

export interface GetAllHolidayRateResponse {
    status: boolean
    message: string
    data?: HolidayRate[]
    errors?: Object
    error_detail?: string
}

export interface CreateHolidayRateResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateHolidayRateResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteHolidayRateResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class HolidayRateService {
    async GetAllHolidayRate(): Promise<GetAllHolidayRateResponse> {
        try {
            const token = Cookies.get('accessToken')

            const holidayRateRequest = await fetch(
                `${BASE_URL}/holiday-rate/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await holidayRateRequest.json()
            console.log('GetAllHolidayRate Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data holiday rate'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetAllHolidayRate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreHolidayRate(dto: HolidayRateCreateDto): Promise<CreateHolidayRateResponse> {
        try {
            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Nama holiday rate tidak boleh kosong!'
                }
            }

            if (!dto.date_start) {
                return {
                    status: false,
                    message: 'Tanggal mulai tidak boleh kosong!'
                }
            }

            if (!dto.rate_type || dto.rate_type.trim() === '') {
                return {
                    status: false,
                    message: 'Jenis tarif tidak boleh kosong!'
                }
            }

            if (dto.multiplier <= 0) {
                return {
                    status: false,
                    message: 'Multiplier harus lebih dari 0!'
                }
            }

            if (!dto.applies_to_zone_id || dto.applies_to_zone_id <= 0) {
                return {
                    status: false,
                    message: 'Zone ID tidak boleh kosong!'
                }
            }

            if (!dto.applies_to_vehicle_type_id || dto.applies_to_vehicle_type_id <= 0) {
                return {
                    status: false,
                    message: 'Tipe kendaraan ID tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const createHolidayRateRequest = await fetch(
                `${BASE_URL}/holiday-rate/create-holiday-rate`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        name: dto.name,
                        date_start: dto.date_start,
                        date_aend: dto.date_aend || null,
                        rate_type: dto.rate_type,
                        multiplier: dto.multiplier,
                        override_fee: dto.override_fee || 0,
                        applies_to_zone_id: dto.applies_to_zone_id,
                        applies_to_vehicle_type_id: dto.applies_to_vehicle_type_id,
                    },
                    token
                )
            )

            const res = await createHolidayRateRequest.json()
            console.log('StoreHolidayRate Response:', res)

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
            console.error('StoreHolidayRate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateHolidayRate(id: number, dto: HolidayRateUpdateDto): Promise<UpdateHolidayRateResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID holiday rate tidak valid!'
                }
            }

            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Nama holiday rate tidak boleh kosong!'
                }
            }

            if (!dto.date_start) {
                return {
                    status: false,
                    message: 'Tanggal mulai tidak boleh kosong!'
                }
            }

            if (!dto.rate_type || dto.rate_type.trim() === '') {
                return {
                    status: false,
                    message: 'Jenis tarif tidak boleh kosong!'
                }
            }

            if (dto.multiplier <= 0) {
                return {
                    status: false,
                    message: 'Multiplier harus lebih dari 0!'
                }
            }

            if (!dto.applies_to_zone_id || dto.applies_to_zone_id <= 0) {
                return {
                    status: false,
                    message: 'Zone ID tidak boleh kosong!'
                }
            }

            if (!dto.applies_to_vehicle_type_id || dto.applies_to_vehicle_type_id <= 0) {
                return {
                    status: false,
                    message: 'Tipe kendaraan ID tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const updateHolidayRateRequest = await fetch(
                `${BASE_URL}/holiday-rate/update-holiday-rate/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        name: dto.name,
                        date_start: dto.date_start,
                        date_aend: dto.date_aend || null,
                        rate_type: dto.rate_type,
                        multiplier: dto.multiplier,
                        override_fee: dto.override_fee || 0,
                        applies_to_zone_id: dto.applies_to_zone_id,
                        applies_to_vehicle_type_id: dto.applies_to_vehicle_type_id,
                    },
                    token
                )
            )

            const res = await updateHolidayRateRequest.json()
            console.log('UpdateHolidayRate Response:', res)

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
            console.error('UpdateHolidayRate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteHolidayRate(id: number): Promise<DeleteHolidayRateResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID holiday rate tidak valid!'
                }
            }

            const token = Cookies.get('token')

            const deleteHolidayRateRequest = await fetch(
                `${BASE_URL}/holiday-rate/delete-holiday-rate/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await deleteHolidayRateRequest.json()
            console.log('DeleteHolidayRate Response:', res)

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
            console.error('DeleteHolidayRate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new HolidayRateService()