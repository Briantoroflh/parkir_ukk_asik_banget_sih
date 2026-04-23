import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface GateDeviceAdsCreateDto {
    gate_device_id: number
    image: string
    title: string
    company: string
}

export interface GateDeviceAdsUpdateDto {
    gate_device_id: number
    image: string
    title: string
    company: string
}

// ============ Models ============
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

// ============ Response Types ============
export interface GateDeviceAdsResponse {
    status: boolean
    message: string
    data?: GateDeviceAds | GateDeviceAds[] | number
    errors?: Object
    error_detail?: string
}

class GateDeviceAdsService {
    // ============ GET ALL ADS ============
    async GetAllAds(): Promise<GateDeviceAdsResponse> {
        try {
            const token = Cookies.get('accessToken')

            const adsRequest = await fetch(
                `${BASE_URL}/gate-device-ads/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            // Check if response is actually JSON
            const contentType = adsRequest.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                console.error('Backend returned non-JSON response:', contentType)
                const text = await adsRequest.text()
                console.error('Response text:', text)
                return {
                    status: false,
                    message: 'Backend error - Invalid response format',
                    error_detail: text.substring(0, 200)
                }
            }

            let res
            try {
                res = await adsRequest.json()
            } catch (jsonError) {
                console.error('Failed to parse JSON:', jsonError)
                return {
                    status: false,
                    message: 'Backend error - Failed to parse response',
                    error_detail: jsonError instanceof Error ? jsonError.message : 'Unknown parse error'
                }
            }

            console.log('GetAllAds Response:', res)

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
            console.error('GetAllAds Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    // ============ GET ADS BY ID ============
    async GetAdsById(id: number): Promise<GateDeviceAdsResponse> {
        try {
            if (id <= 0) {
                return {
                    status: false,
                    message: 'ID tidak boleh kosong atau kurang dari 0!'
                }
            }

            const token = Cookies.get('accessToken')

            const adsRequest = await fetch(
                `${BASE_URL}/gate-device-ads/get/${id}`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            // Check if response is actually JSON
            const contentType = adsRequest.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                console.error('Backend returned non-JSON response:', contentType)
                const text = await adsRequest.text()
                console.error('Response text:', text)
                return {
                    status: false,
                    message: 'Backend error - Invalid response format',
                    error_detail: text.substring(0, 200)
                }
            }

            let res
            try {
                res = await adsRequest.json()
            } catch (jsonError) {
                console.error('Failed to parse JSON:', jsonError)
                return {
                    status: false,
                    message: 'Backend error - Failed to parse response',
                    error_detail: jsonError instanceof Error ? jsonError.message : 'Unknown parse error'
                }
            }

            console.log('GetAdsById Response:', res)

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
            console.error('GetAdsById Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    // ============ GET ADS BY GATE DEVICE ID ============
    async GetAdsByDeviceId(gate_device_id: number): Promise<GateDeviceAdsResponse> {
        try {
            if (gate_device_id <= 0) {
                return {
                    status: false,
                    message: 'Gate Device ID tidak boleh kosong atau kurang dari 0!'
                }
            }

            const token = Cookies.get('accessToken')

            const adsRequest = await fetch(
                `${BASE_URL}/gate-device-ads/by-device/${gate_device_id}`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            // Check if response is actually JSON
            const contentType = adsRequest.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                console.error('Backend returned non-JSON response:', contentType)
                const text = await adsRequest.text()
                console.error('Response text:', text)
                return {
                    status: false,
                    message: 'Backend error - Invalid response format',
                    error_detail: text.substring(0, 200)
                }
            }

            let res
            try {
                res = await adsRequest.json()
            } catch (jsonError) {
                console.error('Failed to parse JSON:', jsonError)
                return {
                    status: false,
                    message: 'Backend error - Failed to parse response',
                    error_detail: jsonError instanceof Error ? jsonError.message : 'Unknown parse error'
                }
            }

            console.log('GetAdsByDeviceId Response:', res)

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
            console.error('GetAdsByDeviceId Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    // ============ CREATE ADS ============
    async CreateAds(dto: GateDeviceAdsCreateDto): Promise<GateDeviceAdsResponse> {
        try {
            // ============ VALIDATION ============
            if (!dto.gate_device_id || dto.gate_device_id <= 0) {
                return {
                    status: false,
                    message: 'Gate Device ID tidak boleh kosong!'
                }
            }

            if (!dto.image || dto.image.trim() === '') {
                return {
                    status: false,
                    message: 'Image tidak boleh kosong!'
                }
            }

            if (!dto.title || dto.title.trim() === '') {
                return {
                    status: false,
                    message: 'Title tidak boleh kosong!'
                }
            }

            if (!dto.company || dto.company.trim() === '') {
                return {
                    status: false,
                    message: 'Company tidak boleh kosong!'
                }
            }

            const token = Cookies.get('accessToken')

            // ============ SEND REQUEST TO BACKEND ============
            const createAdsRequest = await fetch(
                `${BASE_URL}/gate-device-ads/create`,
                METADATA_API_SETTINGS(
                    'POST',
                    {
                        gate_device_id: dto.gate_device_id,
                        image: dto.image.trim(),
                        title: dto.title.trim(),
                        company: dto.company.trim()
                    },
                    token
                )
            )

            // Check if response is actually JSON
            const contentType = createAdsRequest.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                console.error('Backend returned non-JSON response:', contentType)
                const text = await createAdsRequest.text()
                console.error('Response text:', text)
                return {
                    status: false,
                    message: 'Backend error - Invalid response format',
                    error_detail: text.substring(0, 200)
                }
            }

            let res
            try {
                res = await createAdsRequest.json()
            } catch (jsonError) {
                console.error('Failed to parse JSON:', jsonError)
                return {
                    status: false,
                    message: 'Backend error - Failed to parse response',
                    error_detail: jsonError instanceof Error ? jsonError.message : 'Unknown parse error'
                }
            }

            console.log('CreateAds Response:', res)

            // ============ HANDLE RESPONSE ============
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
            console.error('CreateAds Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    // ============ UPDATE ADS ============
    async UpdateAds(id: number, dto: GateDeviceAdsUpdateDto): Promise<GateDeviceAdsResponse> {
        try {
            // ============ VALIDATION ============
            if (id <= 0) {
                return {
                    status: false,
                    message: 'ID tidak boleh kosong atau kurang dari 0!'
                }
            }

            if (!dto.gate_device_id || dto.gate_device_id <= 0) {
                return {
                    status: false,
                    message: 'Gate Device ID tidak boleh kosong!'
                }
            }

            if (!dto.image || dto.image.trim() === '') {
                return {
                    status: false,
                    message: 'Image tidak boleh kosong!'
                }
            }

            if (!dto.title || dto.title.trim() === '') {
                return {
                    status: false,
                    message: 'Title tidak boleh kosong!'
                }
            }

            if (!dto.company || dto.company.trim() === '') {
                return {
                    status: false,
                    message: 'Company tidak boleh kosong!'
                }
            }

            const token = Cookies.get('token')

            // ============ SEND REQUEST TO BACKEND ============
            const updateAdsRequest = await fetch(
                `${BASE_URL}/gate-device-ads/update/${id}`,
                METADATA_API_SETTINGS(
                    'PUT',
                    {
                        gate_device_id: dto.gate_device_id,
                        image: dto.image.trim(),
                        title: dto.title.trim(),
                        company: dto.company.trim()
                    },
                    token
                )
            )

            // Check if response is actually JSON
            const contentType = updateAdsRequest.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                console.error('Backend returned non-JSON response:', contentType)
                const text = await updateAdsRequest.text()
                console.error('Response text:', text)
                return {
                    status: false,
                    message: 'Backend error - Invalid response format',
                    error_detail: text.substring(0, 200)
                }
            }

            let res
            try {
                res = await updateAdsRequest.json()
            } catch (jsonError) {
                console.error('Failed to parse JSON:', jsonError)
                return {
                    status: false,
                    message: 'Backend error - Failed to parse response',
                    error_detail: jsonError instanceof Error ? jsonError.message : 'Unknown parse error'
                }
            }

            console.log('UpdateAds Response:', res)

            // ============ HANDLE RESPONSE ============
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
            console.error('UpdateAds Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }

    // ============ DELETE ADS ============
    async DeleteAds(id: number): Promise<GateDeviceAdsResponse> {
        try {
            // ============ VALIDATION ============
            if (id <= 0) {
                return {
                    status: false,
                    message: 'ID tidak boleh kosong atau kurang dari 0!'
                }
            }

            const token = Cookies.get('token')

            // ============ SEND REQUEST TO BACKEND ============
            const deleteAdsRequest = await fetch(
                `${BASE_URL}/gate-device-ads/delete/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            // Check if response is actually JSON
            const contentType = deleteAdsRequest.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                console.error('Backend returned non-JSON response:', contentType)
                const text = await deleteAdsRequest.text()
                console.error('Response text:', text)
                return {
                    status: false,
                    message: 'Backend error - Invalid response format',
                    error_detail: text.substring(0, 200)
                }
            }

            let res
            try {
                res = await deleteAdsRequest.json()
            } catch (jsonError) {
                console.error('Failed to parse JSON:', jsonError)
                return {
                    status: false,
                    message: 'Backend error - Failed to parse response',
                    error_detail: jsonError instanceof Error ? jsonError.message : 'Unknown parse error'
                }
            }

            console.log('DeleteAds Response:', res)

            // ============ HANDLE RESPONSE ============
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
            console.error('DeleteAds Error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            return {
                status: false,
                message: errorMessage,
                error_detail: err instanceof Error ? err.stack : undefined
            }
        }
    }
}

export default new GateDeviceAdsService()