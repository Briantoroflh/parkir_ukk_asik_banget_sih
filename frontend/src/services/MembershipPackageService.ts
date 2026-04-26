import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface MembershipPackageCreateDto {
    package_name: string
    price: number
    time_period_month: number
}

export interface MembershipPackageUpdateDto {
    package_name: string
    price: number
    time_period_month: number
    is_active: boolean
}

// ============ Response Types ============
export interface MembershipPackage {
    id: number
    package_name: string
    price: number
    time_period_month: number
    is_active: boolean
    created_at?: string
    updated_at?: string
}

export interface GetAllMembershipResponse {
    status: boolean
    message: string
    data?: MembershipPackage[]
    errors?: Object
    error_detail?: string
}

export interface CreateMembershipResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface UpdateMembershipResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface DeleteMembershipResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

class MembershipPackageService {
    async GetAllMembership(): Promise<GetAllMembershipResponse> {
        try {
            const token = Cookies.get('accessToken')

            const request = await fetch(
                `${BASE_URL}/membership-package/get-all-membership`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await request.json()
            console.log('GetAllMembership Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gagal mengambil data membership'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetAllMembership Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async StoreMembership(dto: MembershipPackageCreateDto): Promise<CreateMembershipResponse> {
        try {
            // Frontend Validations
            if (!dto.package_name || dto.package_name.trim() === '') {
                return { status: false, message: 'Nama paket tidak boleh kosong!' }
            }
            if (dto.price < 0) {
                return { status: false, message: 'Harga tidak boleh kurang dari 0!' }
            }
            if (dto.time_period_month <= 0) {
                return { status: false, message: 'Periode waktu harus lebih dari 0 bulan!' }
            }

            const token = Cookies.get('accessToken')

            const request = await fetch(
                `${BASE_URL}/membership-package/create-membership`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        package_name: dto.package_name,
                        price: dto.price,
                        time_period_month: dto.time_period_month
                    },
                    token
                )
            )

            const res = await request.json()
            console.log('StoreMembership Response:', res)

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
            console.error('StoreMembership Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async UpdateMembership(id: number, dto: MembershipPackageUpdateDto): Promise<UpdateMembershipResponse> {
        try {
            if (!id || id <= 0) {
                return { status: false, message: 'ID membership tidak valid!' }
            }
            if (!dto.package_name || dto.package_name.trim() === '') {
                return { status: false, message: 'Nama paket tidak boleh kosong!' }
            }

            const token = Cookies.get('accessToken')

            const request = await fetch(
                `${BASE_URL}/membership-package/update-membership/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        package_name: dto.package_name,
                        price: dto.price,
                        time_period_month: dto.time_period_month,
                        is_active: dto.is_active
                    },
                    token
                )
            )

            const res = await request.json()
            console.log('UpdateMembership Response:', res)

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
            console.error('UpdateMembership Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async DeleteMembership(id: number): Promise<DeleteMembershipResponse> {
        try {
            if (!id || id <= 0) {
                return { status: false, message: 'ID membership tidak valid!' }
            }

            const token = Cookies.get('accessToken') // Disamakan menjadi accessToken

            const request = await fetch(
                `${BASE_URL}/membership-package/delete/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await request.json()
            console.log('DeleteMembership Response:', res)

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
            console.error('DeleteMembership Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new MembershipPackageService()