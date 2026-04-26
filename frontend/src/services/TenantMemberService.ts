import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface TenantMemberCreateDto {
    user_id: number
    pic?: string
    tenant_name?: string
    membership_id: number
}

export interface TenantMemberUpdateDto {
    user_id: number
    pic?: string
    tenant_name?: string
    membership_id: number
}

export interface PaymentMembershipDto {
    order_id: string
    gross_amount: number
}

// ============ Response Types ============
export interface TenantMember {
    id: number
    user_id?: number
    pic: string
    tenant_name: string
    status_membership: string
    total_bill: number
    total_current_payment: number
    is_active: boolean
    membership_id?: number
    start_at?: string
    due_at?: string
    created_at?: string
    updated_at?: string
}

export interface TenantResponse {
    status: boolean
    message: string
    content?: object,
    data?: TenantMember[] | TenantMember | number | any
    errors?: Object
    error_detail?: string
}

class TenantMemberService {
    // 1. Get All Tenants
    async GetAllTenant(): Promise<TenantResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/tenant-member/get-all-tenant`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await request.json()
            console.log('GetAllTenant Response:', res)

            return res
        } catch (err: unknown) {
            console.error('GetAllTenant Error:', err)
            return this.handleCatchError(err)
        }
    }

    // 1.1 Get Tenant Membership By User ID
    async GetTenantByUserId(userId: number): Promise<TenantResponse> {
        try {
            if (!userId || userId <= 0) {
                return { status: false, message: 'User ID tidak valid!' }
            }

            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/tenant-member/get-tenant-by-user/${userId}`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await request.json()
            console.log('GetTenantByUserId Response:', res)

            return res
        } catch (err: unknown) {
            console.error('GetTenantByUserId Error:', err)
            return this.handleCatchError(err)
        }
    }

    // 2. Create Tenant Member
    async CreateTenant(dto: TenantMemberCreateDto): Promise<TenantResponse> {
        try {
            if (!dto.user_id || dto.user_id <= 0) {
                return { status: false, message: 'User ID harus diisi!' }
            }

            if (!dto.membership_id || dto.membership_id <= 0) {
                return { status: false, message: 'ID Membership harus diisi!' }
            }

            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/tenant-member/create-tenant`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        user_id: dto.user_id,
                        pic: dto.pic ?? '',
                        tenant_name: dto.tenant_name ?? '',
                        membership_id: dto.membership_id
                    },
                    token
                )
            )

            const res = await request.json()
            console.log('CreateTenant Response:', res)
            return res
        } catch (err: unknown) {
            console.error('CreateTenant Error:', err)
            return this.handleCatchError(err)
        }
    }

    // 3. Update Tenant Member
    async UpdateTenant(id: number, dto: TenantMemberUpdateDto): Promise<TenantResponse> {
        try {
            if (!id || id <= 0) return { status: false, message: 'ID tenant tidak valid!' }

            if (!dto.user_id || dto.user_id <= 0) {
                return { status: false, message: 'User ID harus diisi!' }
            }

            if (!dto.membership_id || dto.membership_id <= 0) {
                return { status: false, message: 'ID Membership harus diisi!' }
            }

            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/tenant-member/update-tenant/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        user_id: dto.user_id,
                        pic: dto.pic ?? '',
                        tenant_name: dto.tenant_name ?? '',
                        membership_id: dto.membership_id
                    },
                    token
                )
            )

            const res = await request.json()
            console.log('UpdateTenant Response:', res)
            return res
        } catch (err: unknown) {
            console.error('UpdateTenant Error:', err)
            return this.handleCatchError(err)
        }
    }

    // 4. Delete Tenant Member
    async DeleteTenant(id: number): Promise<TenantResponse> {
        try {
            if (!id || id <= 0) return { status: false, message: 'ID tenant tidak valid!' }

            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/tenant-member/delete-tenant/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await request.json()
            console.log('DeleteTenant Response:', res)
            return res
        } catch (err: unknown) {
            console.error('DeleteTenant Error:', err)
            return this.handleCatchError(err)
        }
    }

    // 5. Check Status Due
    async CheckStatusDue(id: number): Promise<TenantResponse> {
        try {
            const token = Cookies.get('accessToken')
            // Query params ?id=... sesuai parameter di controller C#
            const request = await fetch(
                `${BASE_URL}/tenant-member/check-status-due?id=${id}`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await request.json()
            console.log('CheckStatusDue Response:', res)
            return res
        } catch (err: unknown) {
            console.error('CheckStatusDue Error:', err)
            return this.handleCatchError(err)
        }
    }

    // 6. Activate Membership (Manual Activation)
    async ActivateMembership(id: number): Promise<TenantResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/tenant-member/activate-membership/${id}`,
                METADATA_API_SETTINGS('PUT', undefined, token)
            )

            const res = await request.json()
            console.log('ActivateMembership Response:', res)
            return res
        } catch (err: unknown) {
            console.error('ActivateMembership Error:', err)
            return this.handleCatchError(err)
        }
    }

    // 7. Create Membership Payment via Midtrans (QRIS)
    async MembershipPaymentMidtrans(dto: PaymentMembershipDto): Promise<TenantResponse> {
        try {
            if (!dto.order_id || dto.order_id.trim() === '') {
                return { status: false, message: 'Order ID tidak boleh kosong!' }
            }

            if (!dto.gross_amount || dto.gross_amount <= 0) {
                return { status: false, message: 'Gross amount harus lebih dari 0!' }
            }

            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/tenant-member/membership-payment-midtrans`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        order_id: dto.order_id.trim(),
                        gross_amount: dto.gross_amount
                    },
                    token
                )
            )

            const res = await request.json()
            console.log('MembershipPaymentMidtrans Response:', res)
            return res
        } catch (err: unknown) {
            console.error('MembershipPaymentMidtrans Error:', err)
            return this.handleCatchError(err)
        }
    }

    async CheckStatusPaymentMidtrans(order_id: string): Promise<TenantResponse> {
        try {
            // Validasi input
            if (!order_id || order_id.trim() === '') {
                return { 
                    status: false, 
                    message: 'Order ID tidak boleh kosong!' 
                }
            }

            const token = Cookies.get('accessToken')
            
            const request = await fetch(
                `${BASE_URL}/tenant-member/check-status-payment-midtrans`,
                METADATA_API_SETTINGS(
                    'POST', 
                    { order_id: order_id.trim() }, 
                    token
                )
            )

            const res = await request.json()
            console.log('CheckStatusPaymentMidtrans Response:', res)
            
            return res
        } catch (err: unknown) {
            console.error('CheckStatusPaymentMidtrans Error:', err)
            // Pastikan class service Anda memiliki method handleCatchError
            return this.handleCatchError(err)
        }
    }

    // Helper untuk menangani catch block agar kode lebih bersih
    private handleCatchError(err: unknown): TenantResponse {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        return {
            status: false,
            message: errorMessage,
            error_detail: err instanceof Error ? err.stack : undefined
        }
    }
}

export default new TenantMemberService()