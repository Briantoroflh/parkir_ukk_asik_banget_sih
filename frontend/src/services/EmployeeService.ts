import { BASE_URL, METADATA_API_SETTINGS } from "../types"
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface EmployeeCreateDto {
    name: string
    role_id: number
}

export interface EmployeeUpdateDto extends EmployeeCreateDto {}

// ============ Response Types ============
export interface Employee {
    id: number
    name: string
    role_id: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface EmployeeResponse {
    status: boolean
    message: string
    data?: any // Bisa berupa Employee atau Employee[]
    errors?: any
    error_detail?: string
}

class EmployeeService {
    // 1. Get All Employees
    async GetAllEmployee(): Promise<EmployeeResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/employee/get-all`,
                METADATA_API_SETTINGS('GET', undefined, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // 2. Create Employee
    async CreateEmployee(dto: EmployeeCreateDto): Promise<EmployeeResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/employee/create`,
                METADATA_API_SETTINGS('POST', dto, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // 3. Update Employee
    async UpdateEmployee(id: number, dto: EmployeeUpdateDto): Promise<EmployeeResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/employee/update/${id}`,
                METADATA_API_SETTINGS('PUT', dto, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // 4. Delete Employee (Soft Delete)
    async DeleteEmployee(id: number): Promise<EmployeeResponse> {
        try {
            const token = Cookies.get('accessToken')
            const request = await fetch(
                `${BASE_URL}/employee/delete/${id}`,
                METADATA_API_SETTINGS('DELETE', undefined, token)
            )

            const res = await request.json()
            return res
        } catch (err: unknown) {
            return this.handleCatchError(err)
        }
    }

    // Helper Error Handler
    private handleCatchError(err: unknown): EmployeeResponse {
        console.error('EmployeeService Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        return {
            status: false,
            message: errorMessage,
            error_detail: err instanceof Error ? err.stack : undefined
        }
    }
}

export default new EmployeeService()