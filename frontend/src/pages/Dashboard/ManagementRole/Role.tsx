'use client'

import React, { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import { Datatable } from '../../../components/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Trash2, Edit2, Plus, AlertCircle, CheckCircle, User } from 'lucide-react'
import RoleService, { type Role, type RoleCreateDto, type RoleUpdateDto } from '../../../services/RoleService'

export default function RolePage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    // Fetch all roles
    const fetchRoles = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await RoleService.GetAllRole()

            if (response.status && response.data) {
                setRoles(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data role')
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi ke server')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({ name: '', description: '' })
        setEditingRole(null)
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!formData.name.trim()) {
                setError('Nama role wajib diisi!')
                return
            }

            setIsSubmitting(true)

            if (editingRole) {
                const response = await RoleService.UpdateRole(editingRole.id, formData)
                if (response.status) {
                    setSuccess('Role berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchRoles()
                } else {
                    setError(response.message || 'Gagal memperbarui role')
                }
            } else {
                const response = await RoleService.StoreRole(formData)
                if (response.status) {
                    setSuccess('Role baru berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchRoles()
                } else {
                    setError(response.message || 'Gagal menambahkan role')
                }
            }
        } catch (err) {
            setError('Terjadi kesalahan sistem')
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
            setIsSubmitting(true)
            const response = await RoleService.DeleteRole(deleteTargetId)

            if (response.status) {
                setSuccess('Role berhasil dihapus secara permanen!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchRoles()
            } else {
                setError(response.message || 'Gagal menghapus role')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus data')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Modal triggers
    const handleEdit = (role: Role) => {
        setEditingRole(role)
        setFormData({ name: role.name, description: role.description || '' })
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        resetForm()
        setIsModalOpen(true)
    }

    // Auto-dismiss alert
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => { setError(null); setSuccess(null); }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error, success])

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span>{row.index + 1}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Nama Role',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="font-bold">{row.getValue('name')}</span>
                </div>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue('description') || '-'}</span>,
        },
        {
            accessorKey: 'created_by',
            header: 'Dibuat Oleh',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    {row.getValue('created_by') || 'System'}
                </div>
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
                    <Button variant="destructive" size="sm" onClick={() => { setDeleteTargetId(row.original.id); setIsDeleteConfirmOpen(true); }}>
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Role</h1>
                        <p className="text-muted-foreground">Atur hak akses dan level pengguna sistem</p>
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="w-4 h-4" /> Tambah Role
                    </Button>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3 text-destructive">
                        <AlertCircle className="w-5 h-5" /> <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5" /> <span>{success}</span>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Role</CardTitle>
                        <CardDescription>Menampilkan {roles.length} role yang terdaftar di database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-48 flex items-center justify-center text-muted-foreground">Memuat data...</div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={roles}
                                searchColumn="name"
                                searchPlaceholder="Cari role..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Form Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Update Role' : 'Tambah Role Baru'}</DialogTitle>
                        <DialogDescription>Masukkan nama dan deskripsi singkat fungsi role ini.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Role</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: Administrator"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Deskripsi</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Jelaskan wewenang role ini..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Role'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Role Permanen?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan menghapus data dari database. Role yang masih digunakan oleh user mungkin akan menyebabkan error.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}