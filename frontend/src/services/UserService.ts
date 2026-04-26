import { BASE_URL, METADATA_API_SETTINGS } from '../types'
import Cookies from 'js-cookie'

// ============ DTOs ============
export interface UserCreateDto {
	name: string
	email: string
	password_hash: string
	role_id: number
}

// ============ Model ============
export interface UserData {
	id: number
	name: string
	email: string
	is_active: boolean
	role_id: number
	created_at?: string
	updated_at?: string
	deleted_at?: string | null
}

// ============ Response Types ============
export interface UserResponse {
	status: boolean
	message: string
	data?: UserData[] | UserData | number | any
	errors?: Object
	error_detail?: string
}

class UserService {
	// 1. Get All Users
	async GetAllUsers(): Promise<UserResponse> {
		try {
			const token = Cookies.get('accessToken')
			const request = await fetch(
				`${BASE_URL}/users/get-all`,
				METADATA_API_SETTINGS('GET', undefined, token)
			)

			const res = await request.json()
			console.log('GetAllUsers Response:', res)
			return res
		} catch (err: unknown) {
			console.error('GetAllUsers Error:', err)
			return this.handleCatchError(err)
		}
	}

	// 2. Create User
	async CreateUser(dto: UserCreateDto): Promise<UserResponse> {
		try {
			if (!dto.name || dto.name.trim() === '') {
				return { status: false, message: 'Nama harus diisi!' }
			}

			if (!dto.email || dto.email.trim() === '') {
				return { status: false, message: 'Email harus diisi!' }
			}

			if (!dto.password_hash || dto.password_hash.trim() === '') {
				return { status: false, message: 'Password harus diisi!' }
			}

			if (!dto.role_id || dto.role_id <= 0) {
				return { status: false, message: 'Role ID tidak valid!' }
			}

			const token = Cookies.get('accessToken')
			const request = await fetch(
				`${BASE_URL}/users/create-user`,
				METADATA_API_SETTINGS(
					'POST',
					{
						name: dto.name.trim(),
						email: dto.email.trim(),
						password_hash: dto.password_hash,
						role_id: dto.role_id
					},
					token
				)
			)

			const res = await request.json()
			console.log('CreateUser Response:', res)
			return res
		} catch (err: unknown) {
			console.error('CreateUser Error:', err)
			return this.handleCatchError(err)
		}
	}

	// Helper untuk menangani catch block
	private handleCatchError(err: unknown): UserResponse {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
		return {
			status: false,
			message: errorMessage,
			error_detail: err instanceof Error ? err.stack : undefined
		}
	}
}

export default new UserService()