'use client'

import React, { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import { Datatable } from '../../../components/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import ZoneService, { type Zone, type ZoneCreateDto, type ZoneUpdateDto } from '../../../services/ZoneService'

export default function ZonePage() {
    const [zones, setZones] = useState<Zone[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingZone, setEditingZone] = useState<Zone | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        additional_fee: 0,
        is_active: true,
    })

    // Fetch all zones
    const fetchZones = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await ZoneService.GetAllZone()

            if (response.status && response.data) {
                setZones(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data zone')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data zone')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchZones()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            additional_fee: 0,
            is_active: true,
        })
        setEditingZone(null)
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!formData.name.trim()) {
                setError('Nama zona tidak boleh kosong!')
                return
            }

            setIsSubmitting(true)

            if (editingZone) {
                // Update
                const updateDto: ZoneUpdateDto = {
                    name: formData.name,
                    description: formData.description,
                    additional_fee: formData.additional_fee,
                    is_active: formData.is_active,
                }
                const response = await ZoneService.UpdateZone(editingZone.id, updateDto)

                if (response.status) {
                    setSuccess('Zona berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchZones()
                } else {
                    setError(response.message || 'Gagal memperbarui zona')
                }
            } else {
                // Create
                const createDto: ZoneCreateDto = {
                    name: formData.name,
                    description: formData.description,
                    additional_fee: formData.additional_fee,
                }
                const response = await ZoneService.StoreZone(createDto)

                if (response.status) {
                    setSuccess('Zona berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchZones()
                } else {
                    setError(response.message || 'Gagal menambahkan zona')
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

            const response = await ZoneService.DeleteZone(deleteTargetId)

            if (response.status) {
                setSuccess('Zona berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchZones()
            } else {
                setError(response.message || 'Gagal menghapus zona')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus zona')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open edit modal
    const handleEdit = (zone: Zone) => {
        setEditingZone(zone)
        setFormData({
            name: zone.name,
            description: zone.description || '',
            additional_fee: zone.additional_fee,
            is_active: zone.is_active,
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
    const columns: ColumnDef<Zone>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Nama Zona',
            cell: ({ row }) => <span className="font-semibold">{row.getValue('name')}</span>,
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">{row.getValue('description') || '-'}</span>
            ),
        },
        {
            accessorKey: 'additional_fee',
            header: 'Biaya Tambahan (Rp)',
            cell: ({ row }) => (
                <span className="font-medium">
                    {new Intl.NumberFormat('id-ID').format(row.getValue('additional_fee'))}
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Zona Parkir</h1>
                        <p className="text-gray-500 mt-1">Kelola semua zona parkir di sistem</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Zona
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
                        <CardTitle>Daftar Zona Parkir</CardTitle>
                        <CardDescription>
                            Total zona: {zones.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Memuat data...</div>
                            </div>
                        ) : zones.length === 0 ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Tidak ada data zona</div>
                            </div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={zones}
                                searchColumn="name"
                                searchPlaceholder="Cari zona..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingZone ? 'Edit Zona Parkir' : 'Tambah Zona Parkir Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingZone ? 'Perbarui informasi zona parkir' : 'Buat zona parkir baru dalam sistem'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Nama */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nama Zona <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Zona A, Zona Basement"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Deskripsi
                            </Label>
                            <Input
                                id="description"
                                placeholder="Deskripsi zona parkir (opsional)"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Biaya Tambahan */}
                        <div className="space-y-2">
                            <Label htmlFor="additional_fee" className="text-sm font-medium">
                                Biaya Tambahan (Rp)
                            </Label>
                            <Input
                                id="additional_fee"
                                type="number"
                                placeholder="0"
                                value={formData.additional_fee}
                                onChange={(e) => setFormData({ ...formData, additional_fee: parseInt(e.target.value) || 0 })}
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
                            {isSubmitting ? 'Memproses...' : editingZone ? 'Perbarui' : 'Tambahkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Zona Parkir</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus zona ini? Tindakan ini tidak dapat dibatalkan.
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
