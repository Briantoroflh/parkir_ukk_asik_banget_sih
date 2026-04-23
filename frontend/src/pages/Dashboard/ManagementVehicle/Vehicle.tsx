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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import VehicleService, { type Vehicle, type VehicleCreateDto, type VehicleUpdateDto } from '../../../services/VehicleService'
import VehicleTypeService, { type VehicleType } from '../../../services/VehicleTypeService'

export default function VehiclePage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [loading, setLoading] = useState(true)
    const [vehicleTypesLoading, setVehicleTypesLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        plate_number: '',
        vehicle_type_id: 0,
        source: '',
        notes: '',
    })

    // Fetch all vehicle types for dropdown
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

    // Fetch all vehicles
    const fetchVehicles = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await VehicleService.GetAllVehicle()

            if (response.status && response.data) {
                setVehicles(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data kendaraan')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data kendaraan')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVehicleTypes()
        fetchVehicles()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            plate_number: '',
            vehicle_type_id: 0,
            source: '',
            notes: '',
        })
        setEditingVehicle(null)
    }

    // Get vehicle type name by ID
    const getVehicleTypeName = (vehicleTypeId: number): string => {
        const vehicleType = vehicleTypes.find(vt => vt.id === vehicleTypeId)
        return vehicleType?.name || 'N/A'
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!formData.plate_number || formData.plate_number.trim() === '') {
                setError('Nomor plat kendaraan tidak boleh kosong!')
                return
            }

            if (formData.vehicle_type_id === 0) {
                setError('Pilih jenis kendaraan terlebih dahulu!')
                return
            }

            setIsSubmitting(true)

            if (editingVehicle) {
                // Update
                const updateDto: VehicleUpdateDto = {
                    plate_number: formData.plate_number.trim(),
                    vehicle_type_id: formData.vehicle_type_id,
                    source: formData.source || '',
                    notes: formData.notes || '',
                }
                const response = await VehicleService.UpdateVehicle(editingVehicle.id, updateDto)

                if (response.status) {
                    setSuccess('Kendaraan berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchVehicles()
                } else {
                    setError(response.message || 'Gagal memperbarui kendaraan')
                }
            } else {
                // Create
                const createDto: VehicleCreateDto = {
                    plate_number: formData.plate_number.trim(),
                    vehicle_type_id: formData.vehicle_type_id,
                    source: formData.source || '',
                    notes: formData.notes || '',
                }
                const response = await VehicleService.StoreVehicle(createDto)

                if (response.status) {
                    setSuccess('Kendaraan berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchVehicles()
                } else {
                    setError(response.message || 'Gagal menambahkan kendaraan')
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

            const response = await VehicleService.DeleteVehicle(deleteTargetId)

            if (response.status) {
                setSuccess('Kendaraan berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchVehicles()
            } else {
                setError(response.message || 'Gagal menghapus kendaraan')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus kendaraan')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open edit modal
    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle)
        setFormData({
            plate_number: vehicle.plate_number,
            vehicle_type_id: vehicle.vehicle_type_id,
            source: vehicle.source || '',
            notes: vehicle.notes || '',
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
    const columns: ColumnDef<Vehicle>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'plate_number',
            header: 'Nomor Plat',
            cell: ({ row }) => (
                <span className="font-semibold text-gray-900 uppercase">{row.getValue('plate_number')}</span>
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
            accessorKey: 'source',
            header: 'Sumber',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.getValue('source') || '-'}
                </span>
            ),
        },
        {
            accessorKey: 'notes',
            header: 'Catatan',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.getValue('notes') || '-'}
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Kendaraan</h1>
                        <p className="text-gray-500 mt-1">Kelola semua data kendaraan di sistem</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Kendaraan
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
                        <CardTitle>Daftar Kendaraan</CardTitle>
                        <CardDescription>
                            Total kendaraan: {vehicles.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Memuat data...</div>
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Tidak ada data kendaraan</div>
                            </div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={vehicles}
                                searchColumn="plate_number"
                                searchPlaceholder="Cari nomor plat..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingVehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingVehicle ? 'Perbarui informasi kendaraan' : 'Buat kendaraan baru dalam sistem'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Plate Number */}
                        <div className="space-y-2">
                            <Label htmlFor="plate_number" className="text-sm font-medium">
                                Nomor Plat <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="plate_number"
                                placeholder="Contoh: B 1234 ABC"
                                value={formData.plate_number}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, plate_number: e.target.value })}
                            />
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

                        {/* Source */}
                        <div className="space-y-2">
                            <Label htmlFor="source" className="text-sm font-medium">
                                Sumber
                            </Label>
                            <Input
                                id="source"
                                placeholder="Contoh: Tamu, Karyawan, Pemilik"
                                value={formData.source}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, source: e.target.value })}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-medium">
                                Catatan
                            </Label>
                            <Input
                                id="notes"
                                placeholder="Contoh: Catatan tambahan tentang kendaraan"
                                value={formData.notes}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, notes: e.target.value })}
                            />
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
                            {isSubmitting ? 'Memproses...' : editingVehicle ? 'Perbarui' : 'Tambahkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Kendaraan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kendaraan ini? Tindakan ini tidak dapat dibatalkan.
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
