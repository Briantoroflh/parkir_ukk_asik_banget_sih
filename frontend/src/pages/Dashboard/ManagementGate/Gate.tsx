'use client'

import React, { useState, useEffect } from 'react'
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
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import GateService, { type Gate, type GateCreateDto, type GateUpdateDto } from '../../../services/GateService'
import ZoneService, { type Zone } from '../../../services/ZoneService'

export default function GatePage() {
    const [gates, setGates] = useState<Gate[]>([])
    const [zones, setZones] = useState<Zone[]>([])
    const [loading, setLoading] = useState(true)
    const [zonesLoading, setZonesLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingGate, setEditingGate] = useState<Gate | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        zone_id: 0,
        name: '',
        gate_type: '',
        location_desc: '',
        is_active: true,
    })

    // Fetch all zones for dropdown
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

    // Fetch all gates
    const fetchGates = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await GateService.GetAllGate()

            if (response.status && response.data) {
                setGates(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data gate')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data gate')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchZones()
        fetchGates()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            zone_id: 0,
            name: '',
            gate_type: '',
            location_desc: '',
            is_active: true,
        })
        setEditingGate(null)
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!formData.name.trim()) {
                setError('Nama gate tidak boleh kosong!')
                return
            }

            if (formData.zone_id === 0) {
                setError('Pilih zona terlebih dahulu!')
                return
            }

            if (!formData.gate_type.trim()) {
                setError('Tipe gate tidak boleh kosong!')
                return
            }

            setIsSubmitting(true)

            if (editingGate) {
                // Update
                const updateDto: GateUpdateDto = {
                    zone_id: formData.zone_id,
                    name: formData.name,
                    gate_type: formData.gate_type,
                    location_desc: formData.location_desc,
                    is_active: formData.is_active,
                }
                const response = await GateService.UpdateGate(editingGate.id, updateDto)

                if (response.status) {
                    setSuccess('Gate berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchGates()
                } else {
                    setError(response.message || 'Gagal memperbarui gate')
                }
            } else {
                // Create
                const createDto: GateCreateDto = {
                    zone_id: formData.zone_id,
                    name: formData.name,
                    gate_type: formData.gate_type,
                    location_desc: formData.location_desc,
                }
                const response = await GateService.StoreGate(createDto)

                if (response.status) {
                    setSuccess('Gate berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchGates()
                } else {
                    setError(response.message || 'Gagal menambahkan gate')
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

            const response = await GateService.DeleteGate(deleteTargetId)

            if (response.status) {
                setSuccess('Gate berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchGates()
            } else {
                setError(response.message || 'Gagal menghapus gate')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus gate')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open edit modal
    const handleEdit = (gate: Gate) => {
        setEditingGate(gate)
        setFormData({
            zone_id: gate.zone_id,
            name: gate.name,
            gate_type: gate.gate_type,
            location_desc: gate.location_desc || '',
            is_active: gate.is_active,
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
    const columns: ColumnDef<Gate>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Nama Gate',
            cell: ({ row }) => <span className="font-semibold">{row.getValue('name')}</span>,
        },
        {
            accessorKey: 'gate_type',
            header: 'Tipe Gate',
            cell: ({ row }) => <span>{row.getValue('gate_type')}</span>,
        },
        {
            accessorKey: 'zone_id',
            header: 'Zona',
            cell: ({ row }) => {
                const zone = zones.find(z => z.id === row.getValue('zone_id'))
                return <span className="text-sm text-gray-600">{zone?.name || 'N/A'}</span>
            },
        },
        {
            accessorKey: 'location_desc',
            header: 'Deskripsi Lokasi',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">{row.getValue('location_desc') || '-'}</span>
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Gate Parkir</h1>
                        <p className="text-gray-500 mt-1">Kelola semua gate parkir di sistem</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Gate
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
                        <CardTitle>Daftar Gate Parkir</CardTitle>
                        <CardDescription>
                            Total gate: {gates.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Memuat data...</div>
                            </div>
                        ) : gates.length === 0 ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Tidak ada data gate</div>
                            </div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={gates}
                                searchColumn="name"
                                searchPlaceholder="Cari gate..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingGate ? 'Edit Gate Parkir' : 'Tambah Gate Parkir Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingGate ? 'Perbarui informasi gate parkir' : 'Buat gate parkir baru dalam sistem'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Zona */}
                        <div className="space-y-2">
                            <Label htmlFor="zone_id" className="text-sm font-medium">
                                Zona <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.zone_id.toString()} onValueChange={(value) => setFormData({ ...formData, zone_id: parseInt(value) })}>
                                <SelectTrigger id="zone_id">
                                    <SelectValue placeholder="Pilih zona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map((zone) => (
                                        <SelectItem key={zone.id} value={zone.id.toString()}>
                                            {zone.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Nama */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nama Gate <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Gate A, Gate Utama"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Tipe Gate */}
                        <div className="space-y-2">
                            <Label htmlFor="gate_type" className="text-sm font-medium">
                                Tipe Gate <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="gate_type"
                                placeholder="Contoh: ENTRY, EXIT"
                                value={formData.gate_type}
                                onChange={(e) => setFormData({ ...formData, gate_type: e.target.value })}
                            />
                        </div>

                        {/* Deskripsi Lokasi */}
                        <div className="space-y-2">
                            <Label htmlFor="location_desc" className="text-sm font-medium">
                                Deskripsi Lokasi
                            </Label>
                            <Input
                                id="location_desc"
                                placeholder="Deskripsi lokasi gate (opsional)"
                                value={formData.location_desc}
                                onChange={(e) => setFormData({ ...formData, location_desc: e.target.value })}
                            />
                        </div>

                        {/* Status */}
                        {editingGate && (
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
                            {isSubmitting ? 'Memproses...' : editingGate ? 'Perbarui' : 'Tambahkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Gate Parkir</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus gate ini? Tindakan ini tidak dapat dibatalkan.
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
