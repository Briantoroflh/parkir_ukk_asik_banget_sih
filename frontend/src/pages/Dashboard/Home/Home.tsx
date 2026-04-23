import React, { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import MiniCard from '../../../components/mini-card'
import { TrendingUp, Bike, Car } from 'lucide-react'
import { dashboardParkingService } from '../../../services/DashboardParkingService'
import { ChartLineTracking } from '../../../components/chart-line-tracking'
import { type ChartConfig } from '@/components/ui/chart'
import { Datatable } from '../../../components/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import type { ActiveParkingEntry, InactiveParkingEntry } from '../../../services/DashboardParkingService'
import { Button } from '@/components/ui/button'

interface DashboardData {
  tapInToday: number;
  motorEntry: number;
  mobilEntry: number;
}

interface TrafficChartData {
  gate_name: string,
  total_entry: number,
  unique_vehicles: number
}

interface ParkingData {
  activeParking: ActiveParkingEntry[],
  inactiveParking: InactiveParkingEntry[]
}

export default function Home() {
  const [data, setData] = useState<DashboardData>({
    tapInToday: 0,
    motorEntry: 0,
    mobilEntry: 0
  })
  const [trafficData, setTrafficData] = useState<TrafficChartData[]>([])
  const [parkingData, setParkingData] = useState<ParkingData>({
    activeParking: [],
    inactiveParking: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [parkingTab, setParkingTab] = useState<'active' | 'inactive'>('active')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch Tap In Today
        const tapInResponse = await dashboardParkingService.TapinToday()
        let tapInValue = 0
        if (tapInResponse.status && tapInResponse.data) {
          tapInValue = tapInResponse.data.total_tap_in
        }

        // Fetch Vehicle Entry Tracking
        let motorValue = 0
        let mobilValue = 0
        const vehicleResponse = await dashboardParkingService.VehicleEntryTracking()
        if (vehicleResponse.status && vehicleResponse.data && Array.isArray(vehicleResponse.data)) {
          vehicleResponse.data.forEach((vehicle) => {
            if (vehicle.vehicle_type.toLowerCase().includes('motor')) {
              motorValue = vehicle.total_entry
            } else if (vehicle.vehicle_type.toLowerCase().includes('mobil')) {
              mobilValue = vehicle.total_entry
            }
          })
        }

        setData({
          tapInToday: tapInValue,
          motorEntry: motorValue,
          mobilEntry: mobilValue
        })

        // Fetch Traffic Parking
        const trafficResponse = await dashboardParkingService.TrafficParking()
        if (trafficResponse.status && trafficResponse.data && Array.isArray(trafficResponse.data)) {
          const transformedData = trafficResponse.data.map((item) => ({
            gate_name: item.gate_name,
            total_entry: item.total_entry,
            unique_vehicles: item.unique_vehicles
          }))
          setTrafficData(transformedData)
        }

        // Fetch Active Parking Tracking
        const activeParkingResponse = await dashboardParkingService.ActiveParkingTracking()
        let activeData: ActiveParkingEntry[] = []
        if (activeParkingResponse.status && activeParkingResponse.data && Array.isArray(activeParkingResponse.data)) {
          activeData = activeParkingResponse.data
        }

        // Fetch Inactive Parking Tracking
        const inactiveParkingResponse = await dashboardParkingService.InactiveParkingTracking()
        let inactiveData: InactiveParkingEntry[] = []
        if (inactiveParkingResponse.status && inactiveParkingResponse.data && Array.isArray(inactiveParkingResponse.data)) {
          inactiveData = inactiveParkingResponse.data
        }

        setParkingData({
          activeParking: activeData,
          inactiveParking: inactiveData
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Active Parking Columns
  const activeParkingColumns: ColumnDef<ActiveParkingEntry>[] = [
    {
      accessorKey: "transaction_code",
      header: "Kode Transaksi",
    },
    // {
    //   accessorKey: "plate_number",
    //   header: "Plat Nomor",
    // },
    {
      accessorKey: "vehicle_type",
      header: "Jenis Kendaraan",
    },
    {
      accessorKey: "zone",
      header: "Zona",
    },
    {
      accessorKey: "gate_name",
      header: "Gate",
    },
    // {
    //   accessorKey: "fee",
    //   header: "Fee",
    // },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "entry_at",
      header: "Waktu Masuk",
      cell: ({ row }) => {
        const date = new Date(row.getValue("entry_at") as string)
        return date.toLocaleString('id-ID')
      },
    },
    // {
    //   accessorKey: "calculated_fee",
    //   header: "Biaya",
    //   cell: ({ row }) => {
    //     const fee = row.getValue("calculated_fee") as number
    //     return `Rp ${fee.toLocaleString('id-ID')}`
    //   },
    // },
    // {
    //   accessorKey: "payment_amount",
    //   header: "Jumlah Bayar",
    //   cell: ({ row }) => {
    //     const amount = row.getValue("payment_amount") as number
    //     return `Rp ${amount.toLocaleString('id-ID')}`
    //   },
    // },
    // {
    //   accessorKey: "payment_status",
    //   header: "Status Bayar",
    //   cell: ({ row }) => {
    //     const status = row.getValue("payment_status") as string
    //     return (
    //       <span className={`px-2 py-1 rounded text-xs font-semibold ${status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    //         }`}>
    //         {status === 'paid' ? 'Sudah Dibayar' : status}
    //       </span>
    //     )
    //   },
    // },
  ]

  // Inactive Parking Columns
  const inactiveParkingColumns: ColumnDef<InactiveParkingEntry>[] = [
    {
      accessorKey: "transaction_code",
      header: "Kode Transaksi",
    },
    // {
    //   accessorKey: "plate_number",
    //   header: "Plat Nomor",
    // },
    {
      accessorKey: "vehicle_type",
      header: "Jenis Kendaraan",
    },
    {
      accessorKey: "zone_name",
      header: "Zona",
    },
    {
      accessorKey: "gate_name",
      header: "Gate",
    },
    {
      accessorKey: "entry_at",
      header: "Waktu Masuk",
      cell: ({ row }) => {
        const date = new Date(row.getValue("entry_at") as string)
        return date.toLocaleString('id-ID')
      },
    },
    {
      accessorKey: "exit_at",
      header: "Waktu Keluar",
      cell: ({ row }) => {
        const exitDate = row.getValue("exit_at") as string
        if (!exitDate) return '-'
        const date = new Date(exitDate)
        return date.toLocaleString('id-ID')
      },
    },
    {
      accessorKey: "calculated_fee",
      header: "Biaya",
      cell: ({ row }) => {
        const fee = row.getValue("calculated_fee") as number
        return `Rp ${fee.toLocaleString('id-ID')}`
      },
    },
    {
      accessorKey: "exit_method",
      header: "Metode Bayar",
    },
    // {
    //   accessorKey: "payment_amount",
    //   header: "Jumlah Bayar",
    //   cell: ({ row }) => {
    //     const amount = row.getValue("payment_amount") as number
    //     return `Rp ${amount.toLocaleString('id-ID')}`
    //   },
    // },
    // {
    //   accessorKey: "paid_at",
    //   header: "Waktu Pembayaran",
    //   cell: ({ row }) => {
    //     const paidDate = row.getValue("paid_at") as string
    //     if (!paidDate) return '-'
    //     const date = new Date(paidDate)
    //     return date.toLocaleString('id-ID')
    //   },
    // },
  ]

  return (
    <LayoutPage>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniCard
          title="Total Tap In"
          value={data.tapInToday}
          icon={TrendingUp}
          subtitle="Total masuk hari ini"
          variant="blue"
          badge="Hari ini"
        />
        <MiniCard
          title="Total Motor"
          value={data.motorEntry}
          icon={Bike}
          subtitle="Roda dua masuk"
          variant="orange"
          badge="Hari ini"
        />
        <MiniCard
          title="Total Mobil"
          value={data.mobilEntry}
          icon={Car}
          subtitle="Roda empat masuk"
          variant="green"
          badge="Hari ini"
        />
      </div>
      <div className="mt-6 ">
        {trafficData.length > 0 ? (
          <ChartLineTracking
            title="Traffic Parking"
            description="Total kendaraan masuk per gate hari ini"
            data={trafficData as unknown as Record<string, unknown>[]}
            config={{
              total_entry: {
                label: "Total Entry",
                color: "var(--chart-1)",
              },
            } satisfies ChartConfig}
            dataKey="total_entry"
            xAxisKey="gate_name"
            xAxisFormatter={(value) => String(value).slice(0, 10)}
            footerDescription="Data traffic parkir menampilkan total kendaraan yang masuk per gate"
          />
        ) : (
          <div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
            <p className="text-gray-500 text-center">Data traffic parking belum tersedia!</p>
          </div>
        )}
      </div>
      <div className="mt-6">
        <div className="flex gap-4 mb-4">
          <Button
            variant={parkingTab === 'active' ? 'default' : 'outline'}
            onClick={() => setParkingTab('active')}
            className="flex items-center gap-2"
          >
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Parkir Aktif ({parkingData.activeParking.length})
          </Button>
          <Button
            variant={parkingTab === 'inactive' ? 'default' : 'outline'}
            onClick={() => setParkingTab('inactive')}
            className="flex items-center gap-2"
          >
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Parkir Selesai ({parkingData.inactiveParking.length})
          </Button>
        </div>

        {/* Active Parking Table */}
        {parkingTab === 'active' && (
          <div>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Status Aktif:</strong> Kendaraan masih parkir dengan pembayaran sudah dilakukan
              </p>
            </div>
            {parkingData.activeParking.length > 0 ? (
              <Datatable<ActiveParkingEntry, unknown>
                columns={activeParkingColumns}
                data={parkingData.activeParking}
                pageSize={10}
                searchColumn="plate_number"
                searchPlaceholder="Cari berdasarkan plat nomor..."
              />
            ) : (
              <div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
                <p className="text-gray-500 text-center">Tidak ada parkir aktif hari ini</p>
              </div>
            )}
          </div>
        )}

        {/* Inactive Parking Table */}
        {parkingTab === 'inactive' && (
          <div>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Status Selesai:</strong> Kendaraan sudah keluar dengan pembayaran sudah dilakukan
              </p>
            </div>
            {parkingData.inactiveParking.length > 0 ? (
              <Datatable<InactiveParkingEntry, unknown>
                columns={inactiveParkingColumns}
                data={parkingData.inactiveParking}
                pageSize={10}
                searchColumn="plate_number"
                searchPlaceholder="Cari berdasarkan plat nomor..."
              />
            ) : (
              <div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
                <p className="text-gray-500 text-center">Tidak ada parkir yang sudah selesai hari ini</p>
              </div>
            )}
          </div>
        )}
      </div>
    </LayoutPage>
  )
}
