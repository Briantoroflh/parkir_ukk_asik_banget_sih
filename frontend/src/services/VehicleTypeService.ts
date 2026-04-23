import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface VehicleTypeCreateDto {
    name: string
    minimum_fee: number
    description?: string
}

export interface VehicleTypeUpdateDto {
    name: string
    minimum_fee: number
    description?: string
}

// ============ Response Types ============
export interface VehicleType {
    id: number
    name: string
    minimum_fee: number
    description: string
    created_at: string
}

export interface GetAllVehicleTypeResponse {
    status: boolean
    message: string
    data?: VehicleType[]
    errors?: Object
    error_detail?: string
}

export interface CreateVehicleTypeResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateVehicleTypeResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteVehicleTypeResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class VehicleTypeService {
    async GetAllVehicleType(): Promise<GetAllVehicleTypeResponse> {
        try {
            const token = Cookies.get('accessToken')

            const vehicleTypeRequest = await fetch(
                `${BASE_URL}/vehicle-type/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await vehicleTypeRequest.json()
            console.log('GetAllVehicleType Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data vehicle type'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetAllVehicleType Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreVehicleType(dto: VehicleTypeCreateDto): Promise<CreateVehicleTypeResponse> {
        try {
            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Nama vehicle type tidak boleh kosong!'
                }
            }

            if (!dto.minimum_fee || dto.minimum_fee <= 0) {
                return {
                    status: false,
                    message: 'Minimum fee tidak boleh kosong atau harus lebih dari 0!'
                }
            }

            const token = Cookies.get('accessToken')

            const createVehicleTypeRequest = await fetch(
                `${BASE_URL}/vehicle-type/create-vehicle-type`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        name: dto.name.trim(),
                        minimum_fee: dto.minimum_fee,
                        description: dto.description || '',
                    },
                    token
                )
            )

            const res = await createVehicleTypeRequest.json()
            console.log('StoreVehicleType Response:', res)

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
            console.error('StoreVehicleType Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateVehicleType(id: number, dto: VehicleTypeUpdateDto): Promise<UpdateVehicleTypeResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID vehicle type tidak valid!'
                }
            }

            if (!dto.name || dto.name.trim() === '') {
                return {
                    status: false,
                    message: 'Nama vehicle type tidak boleh kosong!'
                }
            }

            if (!dto.minimum_fee || dto.minimum_fee <= 0) {
                return {
                    status: false,
                    message: 'Minimum fee tidak boleh kosong atau harus lebih dari 0!'
                }
            }

            const token = Cookies.get('accessToken')

            const updateVehicleTypeRequest = await fetch(
                `${BASE_URL}/vehicle-type/update-vehicle-type/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        name: dto.name.trim(),
                        minimum_fee: dto.minimum_fee,
                        description: dto.description || ''
                    },
                    token
                )
            )

            const res = await updateVehicleTypeRequest.json()
            console.log('UpdateVehicleType Response:', res)

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
            console.error('UpdateVehicleType Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteVehicleType(id: number): Promise<DeleteVehicleTypeResponse> {
        try {
            if (!id || id <= 0) {
                return {
                    status: false,
                    message: 'ID vehicle type tidak valid!'
                }
            }

            const token = Cookies.get('accessToken')

            const deleteVehicleTypeRequest = await fetch(
                `${BASE_URL}/vehicle-type/delete-vehicle-type/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await deleteVehicleTypeRequest.json()
            console.log('DeleteVehicleType Response:', res)

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
            console.error('DeleteVehicleType Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new VehicleTypeService()