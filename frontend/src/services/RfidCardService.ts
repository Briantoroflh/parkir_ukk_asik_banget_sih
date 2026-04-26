import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface RfidCardCreateDto {
    card_uid: string
    vehicle_id?: number | null
    is_guest: boolean
    is_member: boolean
    employee_id?: number | null
    pic_tenant_id?: number | null
}

export interface RfidCardUpdateDto extends RfidCardCreateDto {}

// ============ Response Types ============
export interface RfidCard {
    id: number
    card_uid: string
    vehicle_id?: number
    is_guest: boolean
    is_member: boolean
    employee_id?: number
    pic_tenant_id?: number
    deactivated_by?: string
    deactivated_at?: string
    created_at?: string
}

export interface RfidCardResponse {
    status: boolean
    message: string
    data?: any
    errors?: any
    error_detail?: string
}

class RfidCardService {
    // 1. Get All RFID Cards
    async GetAllRfidCard(): Promise<RfidCardResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/rfid-card/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // 2. Create RFID Card
    async CreateRfidCard(dto: RfidCardCreateDto): Promise<RfidCardResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/rfid-card/create`,
                METADATA_API_SETTINGS('POST', dto, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // 3. Update RFID Card
    async UpdateRfidCard(id: number, dto: RfidCardUpdateDto): Promise<RfidCardResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/rfid-card/update/${id}`,
                METADATA_API_SETTINGS('PUT', dto, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // 4. Deactivate Card
    async DeactivateCard(id: number): Promise<RfidCardResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/rfid-card/deactivate/${id}`,
                METADATA_API_SETTINGS('POST', undefined, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // 5. Delete RFID Card
    async DeleteRfidCard(id: number): Promise<RfidCardResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/rfid-card/delete/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // Helper Error Handler
    private handleCatchError(err: unknown): RfidCardResponse {
        console.error('RfidCardService Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        return {
            status: false,
            message: errorMessage,
            error_detail: err instanceof Error ? err.stack : undefined
        }
    }
}

export default new RfidCardService()