'use client'

import { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import { Datatable } from '../../../components/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Checkbox } from '../../../components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { Calendar } from '../../../components/ui/calendar'
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle, Calendar as CalendarIcon } from 'lucide-react'
import FeeConfigService, { type FeeConfig, type FeeConfigCreateDto, type FeeConfigUpdateDto } from '../../../services/FeeConfigService'
import ZoneService, { type Zone } from '../../../services/ZoneService'
import VehicleTypeService, { type VehicleType } from '../../../services/VehicleTypeService'

export default function FeeConfigPage() {
    const [feeConfigs, setFeeConfigs] = useState<FeeConfig[]>([])
    const [zones, setZones] = useState<Zone[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [loading, setLoading] = useState(true)
    const [zonesLoading, setZonesLoading] = useState(true)
    const [vehicleTypesLoading, setVehicleTypesLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingFeeConfig, setEditingFeeConfig] = useState<FeeConfig | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        zone_id: 0,
        vehicle_type_id: 0,
        base_fee: 0,
        grace_period_minutes: 0,
        effective_from: '',
        effective_until: '',
        is_active: true,
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

    // Fetch all fee configs
    const fetchFeeConfigs = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await FeeConfigService.GetAllFeeConfig()

            if (response.status && response.data) {
                setFeeConfigs(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data fee config')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data fee config')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchZones()
        fetchVehicleTypes()
        fetchFeeConfigs()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            zone_id: 0,
            vehicle_type_id: 0,
            base_fee: 0,
            grace_period_minutes: 0,
            effective_from: '',
            effective_until: '',
            is_active: true,
        })
        setEditingFeeConfig(null)
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

    // Format datetime for input
    const formatDatetimeForInput = (dateString: string): string => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (formData.zone_id === 0) {
                setError('Pilih zona terlebih dahulu!')
                return
            }

            if (formData.vehicle_type_id === 0) {
                setError('Pilih jenis kendaraan terlebih dahulu!')
                return
            }

            if (formData.base_fee <= 0) {
                setError('Base fee harus lebih dari 0!')
                return
            }

            if (!formData.effective_from) {
                setError('Tanggal efektif tidak boleh kosong!')
                return
            }

            setIsSubmitting(true)

            if (editingFeeConfig) {
                // Update
                const updateDto: FeeConfigUpdateDto = {
                    zone_id: formData.zone_id,
                    vehicle_type_id: formData.vehicle_type_id,
                    base_fee: formData.base_fee,
                    grace_period_minutes: formData.grace_period_minutes,
                    is_active: formData.is_active,
                    effective_from: formData.effective_from,
                    effective_until: formData.effective_until || '',
                }
                const response = await FeeConfigService.UpdateFeeConfig(editingFeeConfig.id, updateDto)

                if (response.status) {
                    setSuccess('Fee config berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchFeeConfigs()
                } else {
                    setError(response.message || 'Gagal memperbarui fee config')
                }
            } else {
                // Create
                const createDto: FeeConfigCreateDto = {
                    zone_id: formData.zone_id,
                    vehicle_type_id: formData.vehicle_type_id,
                    base_fee: formData.base_fee,
                    grace_period_minutes: formData.grace_period_minutes,
                    effective_from: formData.effective_from,
                    effective_until: formData.effective_until || '',
                }
                const response = await FeeConfigService.StoreFeeConfig(createDto)

                if (response.status) {
                    setSuccess('Fee config berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchFeeConfigs()
                } else {
                    setError(response.message || 'Gagal menambahkan fee config')
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

            const response = await FeeConfigService.DeleteFeeConfig(deleteTargetId)

            if (response.status) {
                setSuccess('Fee config berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchFeeConfigs()
            } else {
                setError(response.message || 'Gagal menghapus fee config')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus fee config')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open edit modal
    const handleEdit = (feeConfig: FeeConfig) => {
        setEditingFeeConfig(feeConfig)
        setFormData({
            zone_id: feeConfig.zone_id,
            vehicle_type_id: feeConfig.vehicle_type_id,
            base_fee: feeConfig.base_fee,
            grace_period_minutes: feeConfig.grace_period_minutes,
            effective_from: formatDatetimeForInput(feeConfig.effective_from),
            effective_until: formatDatetimeForInput(feeConfig.effective_until),
            is_active: feeConfig.is_active,
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
    const columns: ColumnDef<FeeConfig>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'zone_id',
            header: 'Zona',
            cell: ({ row }) => (
                <span className="text-sm font-medium text-gray-900">
                    {getZoneName(row.getValue('zone_id') as number)}
                </span>
            ),
        },
        {
            accessorKey: 'vehicle_type_id',
            header: 'Jenis Kendaraan',
            cell: ({ row }) => (
                <span className="text-sm text-gray-700">
                    {getVehicleTypeName(row.getValue('vehicle_type_id') as number)}
                </span>
            ),
        },
        {
            accessorKey: 'base_fee',
            header: 'Tarif Dasar',
            cell: ({ row }) => (
                <span className="text-sm font-medium text-gray-700">
                    Rp {(row.getValue('base_fee') as number).toLocaleString('id-ID')}
                </span>
            ),
        },
        {
            accessorKey: 'grace_period_minutes',
            header: 'Grace Period',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.getValue('grace_period_minutes')} menit
                </span>
            ),
        },
        {
            accessorKey: 'effective_from',
            header: 'Berlaku Dari',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {new Date(row.getValue('effective_from') as string).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
                    {row.getValue('is_active') ? 'Aktif' : 'Nonaktif'}
                </Badge>
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Konfigurasi Tarif</h1>
                        <p className="text-gray-500 mt-1">Kelola konfigurasi tarif parkir per zona dan jenis kendaraan</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Konfigurasi Tarif
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
                        <CardTitle>Daftar Konfigurasi Tarif</CardTitle>
                        <CardDescription>
                            Total konfigurasi: {feeConfigs.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Memuat data...</div>
                            </div>
                        ) : feeConfigs.length === 0 ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Tidak ada data konfigurasi tarif</div>
                            </div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={feeConfigs}
                                searchColumn="zone_id"
                                searchPlaceholder="Cari konfigurasi tarif..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingFeeConfig ? 'Edit Konfigurasi Tarif' : 'Tambah Konfigurasi Tarif Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingFeeConfig ? 'Perbarui informasi konfigurasi tarif' : 'Buat konfigurasi tarif baru dalam sistem'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Zone */}
                        <div className="space-y-2">
                            <Label htmlFor="zone_id" className="text-sm font-medium">
                                Zona <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.zone_id.toString()} onValueChange={(value) => setFormData({ ...formData, zone_id: parseInt(value) })}>
                                <SelectTrigger id="zone_id">
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
                            <Label htmlFor="vehicle_type_id" className="text-sm font-medium">
                                Jenis Kendaraan <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.vehicle_type_id.toString()} onValueChange={(value) => setFormData({ ...formData, vehicle_type_id: parseInt(value) })}>
                                <SelectTrigger id="vehicle_type_id">
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

                        {/* Base Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="base_fee" className="text-sm font-medium">
                                Tarif Dasar (Rp) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="base_fee"
                                type="number"
                                min="1"
                                placeholder="Contoh: 10000"
                                value={formData.base_fee}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, base_fee: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        {/* Grace Period Minutes */}
                        <div className="space-y-2">
                            <Label htmlFor="grace_period_minutes" className="text-sm font-medium">
                                Grace Period (Menit)
                            </Label>
                            <Input
                                id="grace_period_minutes"
                                type="number"
                                min="0"
                                placeholder="Contoh: 15"
                                value={formData.grace_period_minutes}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, grace_period_minutes: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        {/* Effective From */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Berlaku Dari <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="effective_from"
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.effective_from
                                            ? new Date(formData.effective_from).toLocaleDateString('id-ID')
                                            : 'Pilih tanggal dan waktu'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.effective_from ? new Date(formData.effective_from) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const isoString = date.toISOString().slice(0, 16)
                                                setFormData({ ...formData, effective_from: isoString })
                                            }
                                        }}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Effective Until */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Berlaku Sampai
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="effective_until"
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.effective_until
                                            ? new Date(formData.effective_until).toLocaleDateString('id-ID')
                                            : 'Pilih tanggal dan waktu (opsional)'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.effective_until ? new Date(formData.effective_until) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                const isoString = date.toISOString().slice(0, 16)
                                                setFormData({ ...formData, effective_until: isoString })
                                            }
                                        }}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Status */}
                        {editingFeeConfig && (
                            <div className="space-y-2">
                                <Label htmlFor="is_active" className="text-sm font-medium">Status</Label>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                                        {formData.is_active ? 'Aktif' : 'Nonaktif'}
                                    </label>
                                </div>
                            </div>
                        )}
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
                            {isSubmitting ? 'Memproses...' : editingFeeConfig ? 'Perbarui' : 'Tambahkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Konfigurasi Tarif</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus konfigurasi tarif ini? Tindakan ini tidak dapat dibatalkan.
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
