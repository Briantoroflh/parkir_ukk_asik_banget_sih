import type { RouteObject } from "react-router-dom";
import Home from "./Home/Home";
import Zone from "./ManagementZone/Zone";
import Gate from "./ManagementGate/Gate";
import GateDevice from "./ManagementGateDevice/GateDevice";
import VehicleType from "./ManagementVehicleType/VehicleType";
import Vehicle from "./ManagementVehicle/Vehicle";
import FeeConfig from "./ManagementFeeConfig/FeeConfig";
import HolidayRate from "./ManagementHolidayRate/HolidayRate";
import MembershipPackagePage from "./ManagementMembershipPackage/MembershipPackage";
import TenantMemberPage from "./ManagementTenantMember/TenantMember";
import RfidCardPage from "./ManagementRfidCard/RfidCard";
import EmployeePage from "./ManagementEmployee/Employee";
import RolePage from "./ManagementRole/Role";
import Tenant from "./TenantDashboard/Tenant";

export const dashboardRoutes: RouteObject[] = [
    {
        path: '/dashboard',
        element: <Home />
    },

    // Master Data
    {
        path: '/dashboard/master-data/zone',
        element: <Zone />
    },
    {
        path: '/dashboard/master-data/gate',
        element: <Gate />
    },
    {
        path: '/dashboard/master-data/employee',
        element: <EmployeePage />
    },
    {
        path: '/dashboard/master-data/role',
        element: <RolePage />
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
        path: '/dashboard/master-data/rfid-card',
        element: <RfidCardPage />
    },

    // tenant dashboard
    {
        path: '/dashboard/tenant',
        element: <Tenant />
    },

    // Features
    {
        path: '/dashboard/feature/gate-device',
        element: <GateDevice />
    },
    {
        path: '/dashboard/feature/holiday-rate',
        element: <HolidayRate />
    },
    {
        path: '/dashboard/feature/membership-package',
        element: <MembershipPackagePage />
    },
    {
        path: '/dashboard/feature/tenant-member',
        element: <TenantMemberPage />
    },
]

export { default as Home } from './Home/Home'