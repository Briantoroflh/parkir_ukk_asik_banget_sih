import type { RouteObject } from 'react-router-dom'
import EntryParking from './EntryParking'
import ExitParking from './ExitParking'

export const entryParkingRoutes: RouteObject[] = [
    {
        path: '/entry/parking/:uniqUrl',
        element: <EntryParking />
    },
    {
        path: '/exit/parking/:uniqUrl',
        element: <ExitParking />
    }
]

export { default as EntryParking } from './EntryParking'