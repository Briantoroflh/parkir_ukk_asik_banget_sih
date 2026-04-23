import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface VehicleCreateDto {
    plate_number: string
    vehicle_type_id: number
    source?: string
    notes?: string
}

export interface VehicleUpdateDto {
    plate_number: string
    vehicle_type_id: number
    source?: string
    notes?: string
}

// ============ Response Types ============
export interface Vehicle {
    id: number
    plate_number: string
    vehicle_type_id: number
    source: string
    notes: string
    created_at: string
    updated_at: string
}

export interface GetAllVehicleResponse {
    status: boolean
    message: string
    data?: Vehicle[]
    errors?: Object
    error_detail?: string
}

export interface CreateVehicleResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateVehicleResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteVehicleResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class VehicleService {
    async GetAllVehicle(): Promise<GetAllVehicleResponse> {
        try {
            const token = Cookies.get('accessToken')

            const vehicleRequest = await fetch(
                `${BASE_URL}/vehicle/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await vehicleRequest.json()
            console.log('GetAllVehicle Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data vehicle'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetAllVehicle Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreVehicle(dto: VehicleCreateDto): Promise<CreateVehicleResponse> {
        try {
            if (!dto.plate_number || dto.plate_number.trim() === '') {
                return {
                    status: false,
                    message: 'Nomor plat kendaraan tidak boleh kosong!'
                }
            }

            if (!dto.vehicle_type_id || dto.vehicle_type_id <= 0) {
                return {
                    status: false,
                    message: 'Tipe kendaraan tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const createVehicleRequest = await fetch(
                `${BASE_URL}/vehicle/create-vehicle`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        plate_number: dto.plate_number.trim(),
                        vehicle_type_id: dto.vehicle_type_id,
                        source: dto.source || '',
                        notes: dto.notes || '',
                    },
                    token
                )
            )

            const res = await createVehicleRequest.json()
            console.log('StoreVehicle Response:', res)

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
            console.error('StoreVehicle Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateVehicle(id: number, dto: VehicleUpdateDto): Promise<UpdateVehicleResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID vehicle tidak valid!'
                }
            }

            if (!dto.plate_number || dto.plate_number.trim() === '') {
                return {
                    status: false,
                    message: 'Nomor plat kendaraan tidak boleh kosong!'
                }
            }

            if (!dto.vehicle_type_id || dto.vehicle_type_id <= 0) {
                return {
                    status: false,
                    message: 'Tipe kendaraan tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const updateVehicleRequest = await fetch(
                `${BASE_URL}/vehicle/update-vehicle/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        plate_number: dto.plate_number.trim(),
                        vehicle_type_id: dto.vehicle_type_id,
                        source: dto.source || '',
                        notes: dto.notes || ''
                    },
                    token
                )
            )

            const res = await updateVehicleRequest.json()
            console.log('UpdateVehicle Response:', res)

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
            console.error('UpdateVehicle Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteVehicle(id: number): Promise<DeleteVehicleResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID vehicle tidak valid!'
                }
            }

            const token = Cookies.get('accessToken')

            const deleteVehicleRequest = await fetch(
                `${BASE_URL}/vehicle/delete-vehicle/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await deleteVehicleRequest.json()
            console.log('DeleteVehicle Response:', res)

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
            console.error('DeleteVehicle Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new VehicleService()