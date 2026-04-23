'use client'

import { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import { Datatable } from '../../../components/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { Calendar } from '../../../components/ui/calendar'
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle, Calendar as CalendarIcon } from 'lucide-react'
import HolidayRateService, { type HolidayRate, type HolidayRateCreateDto, type HolidayRateUpdateDto } from '../../../services/HolidayRateService'
import ZoneService, { type Zone } from '../../../services/ZoneService'
import VehicleTypeService, { type VehicleType } from '../../../services/VehicleTypeService'

const RATE_TYPES = [
    { value: 'multiplier', label: 'Multiplier' },
    { value: 'fixed', label: 'Tarif Tetap' },
]

export default function HolidayRatePage() {
    const [holidayRates, setHolidayRates] = useState<HolidayRate[]>([])
    const [zones, setZones] = useState<Zone[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [loading, setLoading] = useState(true)
    const [zonesLoading, setZonesLoading] = useState(true)
    const [vehicleTypesLoading, setVehicleTypesLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingHolidayRate, setEditingHolidayRate] = useState<HolidayRate | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        date_start: '',
        date_aend: '',
        rate_type: 'multiplier',
        multiplier: 1,
        override_fee: 0,
        applies_to_zone_id: 0,
        applies_to_vehicle_type_id: 0,
    })

    // Fetch zones for dropdown
    const fetchZones = async () => {
        try {
            setZonesLoading(true)
            const response = await ZoneService.GetAllZone()

            if (response.status && response.data) {
                setZones(response.data)
            }
        } catch (err) {
            console.error('Error fetching zones:', err)
        } finally {
            setZonesLoading(false)
        }
    }

    // Fetch vehicle types for dropdown
    const fetchVehicleTypes = async () => {
        try {
            setVehicleTypesLoading(true)
            const response = await VehicleTypeService.GetAllVehicleType()

            if (response.status && response.data) {
                setVehicleTypes(response.data)
            }
        } catch (err) {
            console.error('Error fetching vehicle types:', err)
        } finally {
            setVehicleTypesLoading(false)
        }
    }

    // Fetch all holiday rates
    const fetchHolidayRates = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await HolidayRateService.GetAllHolidayRate()

            if (response.status && response.data) {
                setHolidayRates(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data holiday rate')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data holiday rate')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchZones()
        fetchVehicleTypes()
        fetchHolidayRates()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            date_start: '',
            date_aend: '',
            rate_type: 'multiplier',
            multiplier: 1,
            override_fee: 0,
            applies_to_zone_id: 0,
            applies_to_vehicle_type_id: 0,
        })
        setEditingHolidayRate(null)
    }

    // Get zone name by ID
    const getZoneName = (zoneId: number): string => {
        const zone = zones.find(z => z.id === zoneId)
        return zone?.name || 'N/A'
    }

    // Get vehicle type name by ID
    const getVehicleTypeName = (vehicleTypeId: number): string => {
        const vehicleType = vehicleTypes.find(vt => vt.id === vehicleTypeId)
        return vehicleType?.name || 'N/A'
    }

    // Get rate type label
    const getRateTypeLabel = (rateType: string): string => {
        const type = RATE_TYPES.find(t => t.value === rateType)
        return type?.label || rateType
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!formData.name || formData.name.trim() === '') {
                setError('Nama holiday rate tidak boleh kosong!')
                return
            }

            if (!formData.date_start) {
                setError('Tanggal mulai tidak boleh kosong!')
                return
            }

            if (!formData.rate_type || formData.rate_type.trim() === '') {
                setError('Jenis tarif tidak boleh kosong!')
                return
            }

            if (formData.multiplier <= 0) {
                setError('Multiplier harus lebih dari 0!')
                return
            }

            if (formData.applies_to_zone_id === 0) {
                setError('Pilih zona terlebih dahulu!')
                return
            }

            if (formData.applies_to_vehicle_type_id === 0) {
                setError('Pilih jenis kendaraan terlebih dahulu!')
                return
            }

            setIsSubmitting(true)

            if (editingHolidayRate) {
                // Update
                const updateDto: HolidayRateUpdateDto = {
                    name: formData.name,
                    date_start: formData.date_start,
                    date_aend: formData.date_aend || undefined,
                    rate_type: formData.rate_type,
                    multiplier: formData.multiplier,
                    override_fee: formData.override_fee,
                    applies_to_zone_id: formData.applies_to_zone_id,
                    applies_to_vehicle_type_id: formData.applies_to_vehicle_type_id,
                }
                const response = await HolidayRateService.UpdateHolidayRate(editingHolidayRate.id, updateDto)

                if (response.status) {
                    setSuccess('Holiday rate berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchHolidayRates()
                } else {
                    setError(response.message || 'Gagal memperbarui holiday rate')
                }
            } else {
                // Create
                const createDto: HolidayRateCreateDto = {
                    name: formData.name,
                    date_start: formData.date_start,
                    date_aend: formData.date_aend || undefined,
                    rate_type: formData.rate_type,
                    multiplier: formData.multiplier,
                    override_fee: formData.override_fee,
                    applies_to_zone_id: formData.applies_to_zone_id,
                    applies_to_vehicle_type_id: formData.applies_to_vehicle_type_id,
                }
                const response = await HolidayRateService.StoreHolidayRate(createDto)

                if (response.status) {
                    setSuccess('Holiday rate berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchHolidayRates()
                } else {
                    setError(response.message || 'Gagal menambahkan holiday rate')
                }
            }
        } catch (err) {
            setError('Terjadi kesalahan saat memproses data')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle delete
    const handleDelete = async () => {
        if (!deleteTargetId) return

        try {
            setError(null)
            setSuccess(null)
            setIsSubmitting(true)

            const response = await HolidayRateService.DeleteHolidayRate(deleteTargetId)

            if (response.status) {
                setSuccess('Holiday rate berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchHolidayRates()
            } else {
                setError(response.message || 'Gagal menghapus holiday rate')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus holiday rate')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open edit modal
    const handleEdit = (holidayRate: HolidayRate) => {
        setEditingHolidayRate(holidayRate)
        setFormData({
            name: holidayRate.name,
            date_start: new Date(holidayRate.date_start).toISOString().slice(0, 16),
            date_aend: holidayRate.date_aend ? new Date(holidayRate.date_aend).toISOString().slice(0, 16) : '',
            rate_type: holidayRate.rate_type,
            multiplier: holidayRate.multiplier,
            override_fee: holidayRate.override_fee,
            applies_to_zone_id: holidayRate.applies_to_zone_id,
            applies_to_vehicle_type_id: holidayRate.applies_to_vehicle_type_id,
        })
        setIsModalOpen(true)
    }

    // Open create modal
    const handleCreate = () => {
        resetForm()
        setIsModalOpen(true)
    }

    // Open delete confirm
    const handleDeleteClick = (id: number) => {
        setDeleteTargetId(id)
        setIsDeleteConfirmOpen(true)
    }

    // Auto-dismiss messages
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null)
                setSuccess(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error, success])

    // Table columns
    const columns: ColumnDef<HolidayRate>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Nama Holiday',
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-gray-900">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'rate_type',
            header: 'Jenis Tarif',
            cell: ({ row }) => (
                <Badge variant="outline">
                    {getRateTypeLabel(row.getValue('rate_type') as string)}
                </Badge>
            ),
        },
        {
            accessorKey: 'multiplier',
            header: 'Multiplier',
            cell: ({ row }) => (
                <span className="text-sm font-medium text-gray-700">
                    {row.getValue('multiplier')}x
                </span>
            ),
        },
        {
            accessorKey: 'date_start',
            header: 'Berlaku Dari',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {new Date(row.getValue('date_start') as string).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            accessorKey: 'applies_to_zone_id',
            header: 'Zona',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {getZoneName(row.getValue('applies_to_zone_id') as number)}
                </span>
            ),
        },
        {
            accessorKey: 'applies_to_vehicle_type_id',
            header: 'Jenis Kendaraan',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {getVehicleTypeName(row.getValue('applies_to_vehicle_type_id') as number)}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(row.original)}
                        className="flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(row.original.id)}
                        className="flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <LayoutPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Holiday Rate</h1>
                        <p className="text-gray-500 mt-1">Kelola tarif khusus untuk hari libur/harbolnas</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Holiday Rate
                    </Button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700">{success}</span>
                    </div>
                )}

                {/* Data Table Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Holiday Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                    <p className="text-sm text-gray-500">Memuat data...</p>
                                </div>
                            </div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={holidayRates}
                                searchColumn="name"
                                searchPlaceholder="Cari holiday rate..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingHolidayRate ? 'Edit Holiday Rate' : 'Tambah Holiday Rate Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingHolidayRate ? 'Perbarui informasi holiday rate' : 'Buat holiday rate baru dalam sistem'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nama Holiday <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Ramadhan 2026"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Date Start */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Berlaku Dari <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date_start
                                            ? new Date(formData.date_start).toLocaleDateString('id-ID')
                                            : 'Pilih tanggal mulai'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date_start ? new Date(formData.date_start) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const isoString = date.toISOString().slice(0, 16)
                                                setFormData({ ...formData, date_start: isoString })
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Date End */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Berlaku Sampai
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date_aend
                                            ? new Date(formData.date_aend).toLocaleDateString('id-ID')
                                            : 'Pilih tanggal akhir (opsional)'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date_aend ? new Date(formData.date_aend) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const isoString = date.toISOString().slice(0, 16)
                                                setFormData({ ...formData, date_aend: isoString })
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Rate Type */}
                        <div className="space-y-2">
                            <Label htmlFor="rate_type" className="text-sm font-medium">
                                Jenis Tarif <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.rate_type} onValueChange={(value) => setFormData({ ...formData, rate_type: value })}>
                                <SelectTrigger id="rate_type">
                                    <SelectValue placeholder="Pilih jenis tarif..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {RATE_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Multiplier */}
                        <div className="space-y-2">
                            <Label htmlFor="multiplier" className="text-sm font-medium">
                                Multiplier <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="multiplier"
                                type="number"
                                step="0.1"
                                min="0.1"
                                placeholder="Contoh: 1.5"
                                value={formData.multiplier}
                                onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) || 1 })}
                            />
                        </div>

                        {/* Override Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="override_fee" className="text-sm font-medium">
                                Override Fee (Rp)
                            </Label>
                            <Input
                                id="override_fee"
                                type="number"
                                min="0"
                                placeholder="Contoh: 50000"
                                value={formData.override_fee}
                                onChange={(e) => setFormData({ ...formData, override_fee: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        {/* Zone */}
                        <div className="space-y-2">
                            <Label htmlFor="applies_to_zone_id" className="text-sm font-medium">
                                Berlaku Untuk Zona <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.applies_to_zone_id.toString()} onValueChange={(value) => setFormData({ ...formData, applies_to_zone_id: parseInt(value) })}>
                                <SelectTrigger id="applies_to_zone_id">
                                    <SelectValue placeholder="Pilih zona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {zonesLoading ? (
                                        <div className="p-2 text-sm text-gray-500">Memuat zona...</div>
                                    ) : zones.length === 0 ? (
                                        <div className="p-2 text-sm text-gray-500">Tidak ada zona</div>
                                    ) : (
                                        zones.map((zone) => (
                                            <SelectItem key={zone.id} value={zone.id.toString()}>
                                                {zone.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Vehicle Type */}
                        <div className="space-y-2">
                            <Label htmlFor="applies_to_vehicle_type_id" className="text-sm font-medium">
                                Berlaku Untuk Jenis Kendaraan <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.applies_to_vehicle_type_id.toString()} onValueChange={(value) => setFormData({ ...formData, applies_to_vehicle_type_id: parseInt(value) })}>
                                <SelectTrigger id="applies_to_vehicle_type_id">
                                    <SelectValue placeholder="Pilih jenis kendaraan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleTypesLoading ? (
                                        <div className="p-2 text-sm text-gray-500">Memuat jenis kendaraan...</div>
                                    ) : vehicleTypes.length === 0 ? (
                                        <div className="p-2 text-sm text-gray-500">Tidak ada jenis kendaraan</div>
                                    ) : (
                                        vehicleTypes.map((vehicleType) => (
                                            <SelectItem key={vehicleType.id} value={vehicleType.id.toString()}>
                                                {vehicleType.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Memproses...' : editingHolidayRate ? 'Perbarui' : 'Tambahkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Holiday Rate</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus holiday rate ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}
