import type { RouteObject } from 'react-router-dom'
import Login from './Login'

export const loginRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <Login />
    }
]

export { default as Login } from './Login'