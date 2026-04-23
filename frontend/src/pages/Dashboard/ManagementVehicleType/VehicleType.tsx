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
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import VehicleTypeService, { type VehicleType, type VehicleTypeCreateDto, type VehicleTypeUpdateDto } from '../../../services/VehicleTypeService'

export default function VehicleTypePage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editingVehicleType, setEditingVehicleType] = useState<VehicleType | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    minimum_fee: 0,
    description: '',
  })

  // Fetch all vehicle types
  const fetchVehicleTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await VehicleTypeService.GetAllVehicleType()

      if (response.status && response.data) {
        setVehicleTypes(response.data)
      } else {
        setError(response.message || 'Gagal mengambil data vehicle type')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data vehicle type')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicleTypes()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      minimum_fee: 0,
      description: '',
    })
    setEditingVehicleType(null)
  }

  // Handle create/update submit
  const handleSubmit = async () => {
    try {
      setError(null)
      setSuccess(null)

      if (!formData.name.trim()) {
        setError('Nama jenis kendaraan tidak boleh kosong!')
        return
      }

      if (formData.minimum_fee <= 0) {
        setError('Tarif minimum harus lebih dari 0!')
        return
      }

      setIsSubmitting(true)

      if (editingVehicleType) {
        // Update
        const updateDto: VehicleTypeUpdateDto = {
          name: formData.name.trim(),
          minimum_fee: formData.minimum_fee,
          description: formData.description,
        }
        const response = await VehicleTypeService.UpdateVehicleType(editingVehicleType.id, updateDto)

        if (response.status) {
          setSuccess('Jenis kendaraan berhasil diperbarui!')
          setIsModalOpen(false)
          resetForm()
          await fetchVehicleTypes()
        } else {
          setError(response.message || 'Gagal memperbarui jenis kendaraan')
        }
      } else {
        // Create
        const createDto: VehicleTypeCreateDto = {
          name: formData.name.trim(),
          minimum_fee: formData.minimum_fee,
          description: formData.description,
        }
        const response = await VehicleTypeService.StoreVehicleType(createDto)

        if (response.status) {
          setSuccess('Jenis kendaraan berhasil ditambahkan!')
          setIsModalOpen(false)
          resetForm()
          await fetchVehicleTypes()
        } else {
          setError(response.message || 'Gagal menambahkan jenis kendaraan')
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

      const response = await VehicleTypeService.DeleteVehicleType(deleteTargetId)

      if (response.status) {
        setSuccess('Jenis kendaraan berhasil dihapus!')
        setIsDeleteConfirmOpen(false)
        setDeleteTargetId(null)
        await fetchVehicleTypes()
      } else {
        setError(response.message || 'Gagal menghapus jenis kendaraan')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus jenis kendaraan')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open edit modal
  const handleEdit = (vehicleType: VehicleType) => {
    setEditingVehicleType(vehicleType)
    setFormData({
      name: vehicleType.name,
      minimum_fee: vehicleType.minimum_fee,
      description: vehicleType.description,
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
  const columns: ColumnDef<VehicleType>[] = [
    {
      accessorKey: 'id',
      header: 'No',
      cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Nama Jenis Kendaraan',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">{row.getValue('name')}</span>
      ),
    },
    {
      accessorKey: 'minimum_fee',
      header: 'Tarif Minimum',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-700">
          Rp {(row.getValue('minimum_fee') as number).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.getValue('description') || '-'}
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
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Jenis Kendaraan</h1>
            <p className="text-gray-500 mt-1">Kelola semua jenis kendaraan di sistem</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Jenis Kendaraan
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
            <CardTitle>Daftar Jenis Kendaraan</CardTitle>
            <CardDescription>
              Total jenis kendaraan: {vehicleTypes.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-gray-500">Memuat data...</div>
              </div>
            ) : vehicleTypes.length === 0 ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-gray-500">Tidak ada data jenis kendaraan</div>
              </div>
            ) : (
              <Datatable
                columns={columns}
                data={vehicleTypes}
                searchColumn="name"
                searchPlaceholder="Cari jenis kendaraan..."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Update Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVehicleType ? 'Edit Jenis Kendaraan' : 'Tambah Jenis Kendaraan Baru'}</DialogTitle>
            <DialogDescription>
              {editingVehicleType ? 'Perbarui informasi jenis kendaraan' : 'Buat jenis kendaraan baru dalam sistem'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Jenis Kendaraan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Contoh: Mobil Penumpang, Motor, Truck"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Minimum Fee */}
            <div className="space-y-2">
              <Label htmlFor="minimum_fee" className="text-sm font-medium">
                Tarif Minimum (Rp) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minimum_fee"
                type="number"
                min="1"
                placeholder="Contoh: 5000"
                value={formData.minimum_fee}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, minimum_fee: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Deskripsi
              </Label>
              <Input
                id="description"
                placeholder="Contoh: Deskripsi singkat tentang jenis kendaraan"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
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
              {isSubmitting ? 'Memproses...' : editingVehicleType ? 'Perbarui' : 'Tambahkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Jenis Kendaraan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jenis kendaraan ini? Tindakan ini tidak dapat dibatalkan.
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
