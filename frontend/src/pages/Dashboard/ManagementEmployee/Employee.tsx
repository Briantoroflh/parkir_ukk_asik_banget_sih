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
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle, User } from 'lucide-react'
import EmployeeService, { type Employee, type EmployeeCreateDto, type EmployeeUpdateDto } from '../../../services/EmployeeService'

export default function EmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        role_id: 0,
    })

    // Fetch all employees
    const fetchEmployees = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await EmployeeService.GetAllEmployee()

            if (response.status && response.data) {
                setEmployees(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data karyawan')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data karyawan')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            role_id: 0,
        })
        setEditingEmployee(null)
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!formData.name.trim()) {
                setError('Nama karyawan tidak boleh kosong!')
                return
            }

            if (formData.role_id <= 0) {
                setError('Pilih Role ID yang valid!')
                return
            }

            setIsSubmitting(true)

            if (editingEmployee) {
                // Update
                const updateDto: EmployeeUpdateDto = {
                    name: formData.name,
                    role_id: formData.role_id,
                }
                const response = await EmployeeService.UpdateEmployee(editingEmployee.id, updateDto)

                if (response.status) {
                    setSuccess('Data karyawan berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchEmployees()
                } else {
                    setError(response.message || 'Gagal memperbarui data karyawan')
                }
            } else {
                // Create
                const createDto: EmployeeCreateDto = {
                    name: formData.name,
                    role_id: formData.role_id,
                }
                const response = await EmployeeService.CreateEmployee(createDto)

                if (response.status) {
                    setSuccess('Karyawan berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchEmployees()
                } else {
                    setError(response.message || 'Gagal menambahkan karyawan')
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

            const response = await EmployeeService.DeleteEmployee(deleteTargetId)

            if (response.status) {
                setSuccess('Karyawan berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchEmployees()
            } else {
                setError(response.message || 'Gagal menghapus karyawan')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus karyawan')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open edit modal
    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee)
        setFormData({
            name: employee.name,
            role_id: employee.role_id,
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
    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Nama Karyawan',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{row.getValue('name')}</span>
                </div>
            ),
        },
        {
            accessorKey: 'role_id',
            header: 'Role ID',
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Role: {row.getValue('role_id')}
                </Badge>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Tgl Terdaftar',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {new Date(row.getValue('created_at')).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Karyawan</h1>
                        <p className="text-gray-500 mt-1">Kelola data master karyawan dan hak akses</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Karyawan
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
                        <CardTitle>Daftar Karyawan</CardTitle>
                        <CardDescription>
                            Total karyawan aktif: {employees.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <div className="ml-3 text-gray-500">Memuat data...</div>
                            </div>
                        ) : employees.length === 0 ? (
                            <div className="flex flex-col justify-center items-center h-48 border-2 border-dashed rounded-lg">
                                <User className="w-10 h-10 text-gray-300 mb-2" />
                                <div className="text-gray-500">Data karyawan masih kosong</div>
                            </div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={employees}
                                searchColumn="name"
                                searchPlaceholder="Cari nama karyawan..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingEmployee ? 'Pastikan data nama dan role sudah sesuai' : 'Isi form di bawah untuk mendaftarkan karyawan baru'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Masukkan nama lengkap"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role_id" className="text-sm font-medium">
                                Role ID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="role_id"
                                type="number"
                                placeholder="Contoh: 1 (Admin), 2 (Staff)"
                                value={formData.role_id || ''}
                                onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) || 0 })}
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
                            {isSubmitting ? 'Memproses...' : editingEmployee ? 'Simpan Perubahan' : 'Daftarkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Karyawan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus karyawan ini? Data akan dipindahkan ke arsip (soft delete).
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
                            {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}