import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

export interface TapInTodayResponse {
    status: boolean,
    message: string,
    data?: {
        total_tap_in: number,
        days_recorded: number
    },
    errors?: Object
}

export interface VehicleEntry {
    id: number,
    vehicle_type: string,
    minimum_fee: number,
    total_entry: number,
    unique_vehicles: number
}

export interface VehicleEntryTrackingResponse {
    status: boolean,
    message: string,
    data?: VehicleEntry[],
    errors?: Object
}

export interface VehicleEntryTrackingParams {
    startDate?: string,
    endDate?: string
}

export interface TrafficParkingEntry {
    zone_id: number,
    zone_name: string,
    gate_id: number,
    gate_name: string,
    gate_type: string,
    total_entry: number,
    unique_vehicles: number
}

export interface TrafficParkingResponse {
    status: boolean,
    message: string,
    data?: TrafficParkingEntry[],
    errors?: Object
}

export interface TrafficParkingParams {
    startDate?: string,
    endDate?: string
}

export interface ActiveParkingEntry {
    transaction_id: number,
    transaction_code: string,
    plate_number: string,
    vehicle_type: string,
    zone_name: string,
    gate_name: string,
    entry_at: string,
    status: string,
    calculated_fee: number,
    payment_status: string,
    payment_amount: number
}

export interface ActiveParkingResponse {
    status: boolean,
    message: string,
    data?: ActiveParkingEntry[],
    errors?: Object
}

export interface ActiveParkingParams {
    startDate?: string,
    endDate?: string
}

export interface InactiveParkingEntry {
    transaction_id: number,
    transaction_code: string,
    plate_number: string,
    vehicle_type: string,
    zone_name: string,
    gate_name: string,
    entry_at: string,
    exit_at: string,
    status: string,
    calculated_fee: number,
    payment_amount: number,
    payment_method: string,
    payment_status: string,
    paid_at: string
}

export interface InactiveParkingResponse {
    status: boolean,
    message: string,
    data?: InactiveParkingEntry[],
    errors?: Object
}

export interface InactiveParkingParams {
    startDate?: string,
    endDate?: string
}

class DashboardParkingService {
    async TapinToday(): Promise<TapInTodayResponse> {
        try {
            const token = Cookies.get('accessToken')

            const getTapInToday = await fetch(`${BASE_URL}/dashboard/tap-in-today`, 
                METADATA_API_SETTINGS('GET', null, token)
            )

            const res = await getTapInToday.json()

            console.log(res)

            if (!res.status) {
                const data: TapInTodayResponse = {
                    status: res.status,
                    message: res.message,
                    errors: res.errors
                }
                return data
            }

            const data: TapInTodayResponse = {
                status: res.status,
                message: res.message,
                data: res.data
            }

            return data
        } catch (err: unknown) {
            console.log(err)

            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            const error: TapInTodayResponse = {
                status: false,
                message: errorMessage
            }

            return error
        }
    }

    async VehicleEntryTracking(params?: VehicleEntryTrackingParams): Promise<VehicleEntryTrackingResponse> {
        try {
           const token = Cookies.get('accessToken')

            const queryParams = new URLSearchParams()
            if (params?.startDate) {
                queryParams.append('startDate', params.startDate)
            }
            if (params?.endDate) {
                queryParams.append('endDate', params.endDate)
            }

            const queryString = queryParams.toString()
            const url = queryString ? `${BASE_URL}/dashboard/vehicle-entry-tracking?${queryString}` : `${BASE_URL}/dashboard/vehicle-entry-tracking`

            const getVehicleEntry = await fetch(url, 
                METADATA_API_SETTINGS('GET', null, token)
            )

            const res = await getVehicleEntry.json()

            console.log(res)

            if (!res.status) {
                const data: VehicleEntryTrackingResponse = {
                    status: res.status,
                    message: res.message,
                    errors: res.errors
                }
                return data
            }

            const data: VehicleEntryTrackingResponse = {
                status: res.status,
                message: res.message,
                data: res.data
            }

            return data
        } catch (err: unknown) {
            console.log(err)

            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            const error: VehicleEntryTrackingResponse = {
                status: false,
                message: errorMessage
            }

            return error
        }
    }

    async TrafficParking(params?: TrafficParkingParams): Promise<TrafficParkingResponse> {
        try {
            const token = Cookies.get('accessToken')

            const queryParams = new URLSearchParams()
            if (params?.startDate) {
                queryParams.append('startDate', params.startDate)
            }
            if (params?.endDate) {
                queryParams.append('endDate', params.endDate)
            }

            const queryString = queryParams.toString()
            const url = queryString ? `${BASE_URL}/dashboard/traffic-parking?${queryString}` : `${BASE_URL}/dashboard/traffic-parking`

            const getTrafficParking = await fetch(url, 
                METADATA_API_SETTINGS('GET', null, token)
            )

            const res = await getTrafficParking.json()

            console.log(res)

            if (!res.status) {
                const data: TrafficParkingResponse = {
                    status: res.status,
                    message: res.message,
                    errors: res.errors
                }
                return data
            }

            const data: TrafficParkingResponse = {
                status: res.status,
                message: res.message,
                data: res.data
            }

            return data
        } catch (err: unknown) {
            console.log(err)

            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            const error: TrafficParkingResponse = {
                status: false,
                message: errorMessage
            }

            return error
        }
    }

    async ActiveParkingTracking(params?: ActiveParkingParams): Promise<ActiveParkingResponse> {
        try {
            const token = Cookies.get('accessToken')

            const queryParams = new URLSearchParams()
            if (params?.startDate) {
                queryParams.append('startDate', params.startDate)
            }
            if (params?.endDate) {
                queryParams.append('endDate', params.endDate)
            }

            const queryString = queryParams.toString()
            const url = queryString ? `${BASE_URL}/dashboard/active-parking-tracking?${queryString}` : `${BASE_URL}/dashboard/active-parking-tracking`

            const getActiveParking = await fetch(url, 
                METADATA_API_SETTINGS('GET', null, token)
            )

            const res = await getActiveParking.json()

            console.log(res)

            if (!res.status) {
                const data: ActiveParkingResponse = {
                    status: res.status,
                    message: res.message,
                    errors: res.errors
                }
                return data
            }

            const data: ActiveParkingResponse = {
                status: res.status,
                message: res.message,
                data: res.data
            }

            return data
        } catch (err: unknown) {
            console.log(err)

            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            const error: ActiveParkingResponse = {
                status: false,
                message: errorMessage
            }

            return error
        }
    }

    async InactiveParkingTracking(params?: InactiveParkingParams): Promise<InactiveParkingResponse> {
        try {
            const token = Cookies.get('accessToken')

            const queryParams = new URLSearchParams()
            if (params?.startDate) {
                queryParams.append('startDate', params.startDate)
            }
            if (params?.endDate) {
                queryParams.append('endDate', params.endDate)
            }

            const queryString = queryParams.toString()
            const url = queryString ? `${BASE_URL}/dashboard/inactive-parking-tracking?${queryString}` : `${BASE_URL}/dashboard/inactive-parking-tracking`

            const getInactiveParking = await fetch(url, 
                METADATA_API_SETTINGS('GET', null, token)
            )

            const res = await getInactiveParking.json()

            console.log(res)

            if (!res.status) {
                const data: InactiveParkingResponse = {
                    status: res.status,
                    message: res.message,
                    errors: res.errors
                }
                return data
            }

            const data: InactiveParkingResponse = {
                status: res.status,
                message: res.message,
                data: res.data
            }

            return data
        } catch (err: unknown) {
            console.log(err)

            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

            const error: InactiveParkingResponse = {
                status: false,
                message: errorMessage
            }

            return error
        }
    }
}

export const dashboardParkingService = new DashboardParkingService()