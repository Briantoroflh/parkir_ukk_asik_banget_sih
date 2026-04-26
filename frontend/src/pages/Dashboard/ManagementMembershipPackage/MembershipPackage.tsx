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
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle, Package } from 'lucide-react'
import MembershipPackageService, {
    type MembershipPackage,
    type MembershipPackageCreateDto,
    type MembershipPackageUpdateDto
} from '../../../services/MembershipPackageService'

export default function MembershipPackagePage() {
    const [packages, setPackages] = useState<MembershipPackage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingPackage, setEditingPackage] = useState<MembershipPackage | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        package_name: '',
        price: 0,
        time_period_month: 1,
        is_active: true,
    })

    // Fetch all membership packages
    const fetchPackages = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await MembershipPackageService.GetAllMembership()

            if (response.status && response.data) {
                setPackages(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data membership')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data membership')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPackages()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            package_name: '',
            price: 0,
            time_period_month: 1,
            is_active: true,
        })
        setEditingPackage(null)
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!formData.package_name.trim()) {
                setError('Nama paket tidak boleh kosong!')
                return
            }

            setIsSubmitting(true)

            if (editingPackage) {
                // Update
                const updateDto: MembershipPackageUpdateDto = {
                    package_name: formData.package_name,
                    price: formData.price,
                    time_period_month: formData.time_period_month,
                    is_active: formData.is_active,
                }
                const response = await MembershipPackageService.UpdateMembership(editingPackage.id, updateDto)

                if (response.status) {
                    setSuccess('Paket membership berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchPackages()
                } else {
                    setError(response.message || 'Gagal memperbarui paket')
                }
            } else {
                // Create
                const createDto: MembershipPackageCreateDto = {
                    package_name: formData.package_name,
                    price: formData.price,
                    time_period_month: formData.time_period_month,
                }
                const response = await MembershipPackageService.StoreMembership(createDto)

                if (response.status) {
                    setSuccess('Paket membership berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchPackages()
                } else {
                    setError(response.message || 'Gagal menambahkan paket')
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

            const response = await MembershipPackageService.DeleteMembership(deleteTargetId)

            if (response.status) {
                setSuccess('Paket membership berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchPackages()
            } else {
                setError(response.message || 'Gagal menghapus paket')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus paket')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (pkg: MembershipPackage) => {
        setEditingPackage(pkg)
        setFormData({
            package_name: pkg.package_name,
            price: pkg.price,
            time_period_month: pkg.time_period_month,
            is_active: pkg.is_active,
        })
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const handleDeleteClick = (id: number) => {
        setDeleteTargetId(id)
        setIsDeleteConfirmOpen(true)
    }

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
    const columns: ColumnDef<MembershipPackage>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'package_name',
            header: 'Nama Paket',
            cell: ({ row }) => <span className="font-semibold">{row.getValue('package_name')}</span>,
        },
        {
            accessorKey: 'price',
            header: 'Harga (Rp)',
            cell: ({ row }) => (
                <span className="font-medium text-blue-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.getValue('price'))}
                </span>
            ),
        },
        {
            accessorKey: 'time_period_month',
            header: 'Durasi',
            cell: ({ row }) => <span>{row.getValue('time_period_month')} Bulan</span>,
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
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(row.original.id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Hapus
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <LayoutPage>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Master Membership</h1>
                        <p className="text-gray-500 mt-1">Kelola paket langganan dan membership tenant</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Tambah Paket
                    </Button>
                </div>

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

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Paket Membership</CardTitle>
                        <CardDescription>Total paket tersedia: {packages.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48 text-gray-500">Memuat data...</div>
                        ) : packages.length === 0 ? (
                            <div className="flex justify-center items-center h-48 text-gray-500">Tidak ada data paket</div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={packages}
                                searchColumn="package_name"
                                searchPlaceholder="Cari nama paket..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingPackage ? 'Edit Paket Membership' : 'Tambah Paket Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingPackage ? 'Perbarui detail paket membership' : 'Buat paket membership baru untuk tenant'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="package_name">Nama Paket <span className="text-red-500">*</span></Label>
                            <Input
                                id="package_name"
                                placeholder="Contoh: Paket Bulanan Pro"
                                value={formData.package_name}
                                onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga (Rp)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time_period_month">Durasi (Bulan)</Label>
                                <Input
                                    id="time_period_month"
                                    type="number"
                                    min="1"
                                    value={formData.time_period_month}
                                    onChange={(e) => setFormData({ ...formData, time_period_month: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>

                        {editingPackage && (
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <Label htmlFor="is_active">Paket Aktif</Label>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Memproses...' : editingPackage ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Paket?</DialogTitle>
                        <DialogDescription>Tindakan ini permanen. Paket yang dihapus tidak bisa dikembalikan.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}