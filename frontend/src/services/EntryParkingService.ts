import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface EntryParkingRfidDto {
    rfid: string
    plate: string
    vehicle_type: string
    gate: string
}

export interface ExitParkingRfidDto {
    transaction_id: string
    calculated_fee: number
    gate: string
}

export interface CheckTransactionDto {
    rfid: string
    gate: string
}

// ============ Response Types ============
export interface EntryParkingRfidResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface ExitParkingRfidResponse {
    status: boolean
    message: string
    data?: any
    errors?: Object
    error_detail?: string
}

export interface CheckTransactionResponse {
    status: boolean
    message: string
    data?: {
        transaction_code: string
        calculated_fee: number
        vehicle_type: string
    }
    errors?: Object
    error_detail?: string
}

export interface GateData {
    zone_id: number
    fee_config_id: number
    vehicle_type_id: number
    zone_name: string
    zone_capacity: number
    base_fee: number
}

export interface RfidCardData {
    id: number
    card_uid: string
    is_guest: boolean
    is_member: boolean
    employee_id: number | null
    vehicle_id: number | null
}

export interface GateDeviceAdsData {
    id: number
    gate_device_id: number
    image: string
    title: string
    company: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface GateDeviceData {
    id: number
    gate_id: number
    uniqUrl: string
    gate_name: string
    device_type: string
    status: string
    las_ping_at: string
    error_message: string | null
    created_at: string
    updated_at: string
}

export interface GetDeviceGateResponse {
    status: boolean
    message: string
    data?: {
        device: GateDeviceData
        ads: GateDeviceAdsData[]
    }
    error_detail?: string
}

class EntryParkingService {
    private async parseJsonResponse(request: Response): Promise<
        | { ok: true; body: any }
        | { ok: false; message: string; error_detail?: string }
    > {
        const contentType = request.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
            const text = await request.text()
            console.error('Backend returned non-JSON response:', contentType)
            console.error('Response text:', text)
            return {
                ok: false,
                message: 'Backend error - Invalid response format',
                error_detail: text.substring(0, 200)
            }
        }

        try {
            const body = await request.json()
            return { ok: true, body }
        } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError)
            return {
                ok: false,
                message: 'Backend error - Failed to parse response',
                error_detail: jsonError instanceof Error ? jsonError.message : 'Unknown parse error'
            }
        }
    }

    async GetDeviceGate(uniqUrl: string): Promise<GetDeviceGateResponse> {
        try {
            if (!uniqUrl || uniqUrl.trim() === '') {
                return {
                    status: false,
                    message: 'uniqUrl tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            const deviceRequest = await fetch(
                `${BASE_URL}/gate-device/device/${uniqUrl}`,
                METADATA_API_SETTINGS(
                    'GET',
                    undefined,
                    token
                )
            )

            const parsedResponse = await this.parseJsonResponse(deviceRequest)
            if (!parsedResponse.ok) {
                return {
                    status: false,
                    message: parsedResponse.message,
                    error_detail: parsedResponse.error_detail
                }
            }

            const res = parsedResponse.body

            console.log('GetDeviceGate Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message,
                    error_detail: res.error_detail || 'Gate device tidak ditemukan!'
                }
            }

            return {
                status: res.status,
                message: res.message,
                data: res.data
            }
        } catch (err: unknown) {
            console.error('GetDeviceGate Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async ExitRfid(dto: ExitParkingRfidDto): Promise<ExitParkingRfidResponse> {
        try {
            if (!dto.transaction_id || dto.transaction_id.trim() === '') {
                return {
                    status: false,
                    message: 'Transaction id tidak boleh kosong!'
                }
            }

            if (!dto.gate || dto.gate.trim() === '') {
                return {
                    status: false,
                    message: 'Gate harus diisi!'
                }
            }

            const token = Cookies.get('accessToken')

            const exitRfidRequest = await fetch(
                `${BASE_URL}/exit-parking/exit-rfid`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        transaction_id: dto.transaction_id.trim(),
                        calculated_fee: dto.calculated_fee,
                        gate: dto.gate.trim()
                    },
                    token
                )
            )

            const parsedResponse = await this.parseJsonResponse(exitRfidRequest)
            if (!parsedResponse.ok) {
                return {
                    status: false,
                    message: parsedResponse.message,
                    error_detail: parsedResponse.error_detail
                }
            }

            const res = parsedResponse.body

            console.log('Exit RFID Response:', res)

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
            console.error('ExitRfid Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async CheckTransaction(dto: CheckTransactionDto): Promise<CheckTransactionResponse> {
        try {
            if (!dto.rfid || dto.rfid.trim() === '') {
                return {
                    status: false,
                    message: 'RFID tidak boleh kosong!'
                }
            }

            if (!dto.gate || dto.gate.trim() === '') {
                return {
                    status: false,
                    message: 'Gate harus diisi!'
                }
            }

            const token = Cookies.get('accessToken')

            const checkTransactionRequest = await fetch(
                `${BASE_URL}/exit-parking/check-transaction`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        rfid: dto.rfid.trim(),
                        gate: dto.gate.trim()
                    },
                    token
                )
            )

            const parsedResponse = await this.parseJsonResponse(checkTransactionRequest)
            if (!parsedResponse.ok) {
                return {
                    status: false,
                    message: parsedResponse.message,
                    error_detail: parsedResponse.error_detail
                }
            }

            const res = parsedResponse.body

            console.log('Check Transaction Response:', res)

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
            console.error('CheckTransaction Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    async EntryRfid(dto: EntryParkingRfidDto): Promise<EntryParkingRfidResponse> {
        try {
            // ============ VALIDATION ============
            if (!dto.rfid || dto.rfid.trim() === '') {
                return {
                    status: false,
                    message: 'Rfid tidak di tap-in!'
                }
            }

            if (!dto.plate || dto.plate.trim() === '') {
                return {
                    status: false,
                    message: 'Plate number harus di capture!'
                }
            }

            if (!dto.gate || dto.gate.trim() === '') {
                return {
                    status: false,
                    message: 'Gate harus diisi!'
                }
            }

            if (!dto.vehicle_type || dto.vehicle_type.trim() === '') {
                return {
                    status: false,
                    message: 'Jenis kendaraan harus diketahui!'
                }
            }

            const token = Cookies.get('accessToken')

            // ============ SEND REQUEST TO BACKEND ============
            const entryRfidRequest = await fetch(
                `${BASE_URL}/entry-parking/entry-rfid`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        rfid: dto.rfid.trim(),
                        plate: dto.plate.trim(),
                        vehicle_type: dto.vehicle_type.trim(),
                        gate: dto.gate.trim()
                    },
                    token
                )
            )

            // ============ HANDLE RESPONSE ============
            const parsedResponse = await this.parseJsonResponse(entryRfidRequest)
            if (!parsedResponse.ok) {
                return {
                    status: false,
                    message: parsedResponse.message,
                    error_detail: parsedResponse.error_detail
                }
            }

            const res = parsedResponse.body

            console.log('Entry RFID Response:', res)

            if (!res.status) {
                return {
                    status: res.status,
                    message: res.message || 'Backend returned error',
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
            console.error('EntryRfid Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    
}

export default new EntryParkingService()