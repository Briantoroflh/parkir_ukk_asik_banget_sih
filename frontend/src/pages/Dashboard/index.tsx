import type { RouteObject } from "react-router-dom";
import Home from "./Home/Home";
import Zone from "./ManagementZone/Zone";
import Gate from "./ManagementGate/Gate";
import GateDevice from "./ManagementGateDevice/GateDevice";
import VehicleType from "./ManagementVehicleType/VehicleType";
import Vehicle from "./ManagementVehicle/Vehicle";
import FeeConfig from "./ManagementFeeConfig/FeeConfig";
import HolidayRate from "./ManagementHolidayRate/HolidayRate";

export const dashboardRoutes: RouteObject[] = [
    {
        path: '/dashboard',
        element: <Home />
    },
    {
        path: '/dashboard/master-data/zone',
        element: <Zone />
    },
    {
        path: '/dashboard/master-data/gate',
        element: <Gate />
    },
    {
        path: '/dashboard/master-data/vehicle',
        element: <Vehicle />
    },
    {
        path: '/dashboard/master-data/vehicle-type',
        element: <VehicleType />
    },
    {
        path: '/dashboard/master-data/fee-config',
        element: <FeeConfig />
    },
    {
        path: '/dashboard/feature/gate-device',
        element: <GateDevice />
    },
    {
        path: '/dashboard/feature/holiday-rate',
        element: <HolidayRate />
    },
]

export { default as Home } from './Home/Home'