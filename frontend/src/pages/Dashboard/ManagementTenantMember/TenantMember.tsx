'use client'

import { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import { Datatable } from '../../../components/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react'
import TenantMemberService, { type TenantMember, type TenantMemberCreateDto, type TenantMemberUpdateDto } from '../../../services/TenantMemberService'
import MembershipPackageService, { type MembershipPackage } from '../../../services/MembershipPackageService'
import UserService, { type UserData } from '../../../services/UserService'

export default function TenantMemberPage() {
    const [tenants, setTenants] = useState<TenantMember[]>([])
    const [packages, setPackages] = useState<MembershipPackage[]>([])
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingTenant, setEditingTenant] = useState<TenantMember | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        user_id: 0,
        pic: '',
        tenant_name: '',
        membership_id: 0,
    })

    const userIdOptions = Array.from(
        new Set(
            users
                .map((user) => user.id)
                .filter((userId): userId is number => typeof userId === 'number' && userId > 0)
        )
    ).sort((a, b) => a - b)

    // Fetch Initial Data
    const fetchData = async () => {
        try {
            setLoading(true)
            const [tenantRes, packageRes, userRes] = await Promise.all([
                TenantMemberService.GetAllTenant(),
                MembershipPackageService.GetAllMembership(),
                UserService.GetAllUsers()
            ])

            if (tenantRes.status) setTenants(tenantRes.data || [])
            if (packageRes.status) setPackages(packageRes.data || [])
            if (userRes.status) setUsers((userRes.data as UserData[]) || [])

            if (!tenantRes.status) setError(tenantRes.message)
            if (!userRes.status) setError(userRes.message)
        } catch (err) {
            setError('Gagal memuat data dari server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const resetForm = () => {
        setFormData({ user_id: 0, pic: '', tenant_name: '', membership_id: 0 })
        setEditingTenant(null)
    }

    const handleSubmit = async () => {
        try {
            setError(null)
            if (formData.user_id <= 0 || !formData.pic || !formData.tenant_name || formData.membership_id === 0) {
                setError('Semua field wajib diisi!')
                return
            }

            setIsSubmitting(true)
            let response

            if (editingTenant) {
                const updateDto: TenantMemberUpdateDto = {
                    user_id: formData.user_id,
                    pic: formData.pic,
                    tenant_name: formData.tenant_name,
                    membership_id: formData.membership_id
                }
                response = await TenantMemberService.UpdateTenant(editingTenant.id, updateDto)
            } else {
                const createDto: TenantMemberCreateDto = {
                    user_id: formData.user_id,
                    pic: formData.pic,
                    tenant_name: formData.tenant_name,
                    membership_id: formData.membership_id
                }
                response = await TenantMemberService.CreateTenant(createDto)
            }

            if (response.status) {
                setSuccess(editingTenant ? 'Data tenant diperbarui!' : 'Tenant baru berhasil didaftarkan!')
                setIsModalOpen(false)
                resetForm()
                fetchData()
            } else {
                setError(response.message)
            }
        } catch (err) {
            setError('Terjadi kesalahan sistem')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTargetId) return
        try {
            setIsSubmitting(true)
            const response = await TenantMemberService.DeleteTenant(deleteTargetId)
            if (response.status) {
                setSuccess('Tenant berhasil dihapus')
                setIsDeleteConfirmOpen(false)
                fetchData()
            } else {
                setError(response.message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleActivate = async (id: number) => {
        try {
            const res = await TenantMemberService.ActivateMembership(id)
            if (res.status) {
                setSuccess('Membership diaktifkan!')
                fetchData()
            } else {
                setError(res.message)
            }
        } catch (err) { setError('Gagal aktivasi') }
    }

    const columns: ColumnDef<TenantMember>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span>{row.index + 1}</span>,
        },
        {
            accessorKey: 'tenant_name',
            header: 'Nama Tenant',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold">{row.getValue('tenant_name')}</span>
                    <span className="text-xs text-gray-500 italic">PIC: {row.original.pic}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status_membership',
            header: 'Status Member',
            cell: ({ row }) => {
                const status = row.getValue('status_membership') as string
                return (
                    <Badge variant={status === 'active' ? 'default' : 'destructive'}>
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'due_at',
            header: 'Jatuh Tempo',
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    {row.original.due_at ? new Date(row.original.due_at).toLocaleDateString('id-ID') : '-'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    {row.original.status_membership !== 'active' && (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleActivate(row.original.id)}>
                            <ShieldCheck className="w-4 h-4 mr-1" /> Aktivasi
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => {
                        setEditingTenant(row.original)
                        setFormData({
                            user_id: row.original.user_id || 0,
                            pic: row.original.pic,
                            tenant_name: row.original.tenant_name,
                            membership_id: row.original.membership_id || 0,
                        })
                        setIsModalOpen(true)
                    }}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                        setDeleteTargetId(row.original.id)
                        setIsDeleteConfirmOpen(true)
                    }}>
                        <Trash2 className="w-4 h-4" />
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Tenant</h1>
                        <p className="text-gray-500 mt-1">Kelola data member tenant dan status langganan mereka</p>
                    </div>
                    <Button onClick={() => { resetForm(); setIsModalOpen(true) }} className="gap-2">
                        <Plus className="w-4 h-4" /> Tambah Tenant
                    </Button>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex gap-3 items-center"><AlertCircle className="w-5 h-5" /> {error}</div>}
                {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex gap-3 items-center"><CheckCircle className="w-5 h-5" /> {success}</div>}

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Tenant Member</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-48 flex items-center justify-center text-gray-500">Memuat data...</div>
                        ) : (
                            <Datatable columns={columns} data={tenants} searchColumn="tenant_name" searchPlaceholder="Cari tenant..." />
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingTenant ? 'Edit Data Tenant' : 'Registrasi Tenant Baru'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>User ID</Label>
                            <select
                                className="w-full border rounded-md p-2 text-sm"
                                value={formData.user_id}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, user_id: parseInt(e.target.value) || 0 })}
                            >
                                <option value={0}>-- Pilih User ID --</option>
                                {userIdOptions.map((userId) => {
                                    const user = users.find((item) => item.id === userId)
                                    return (
                                        <option key={userId} value={userId}>
                                            {`#${userId}${user ? ` - ${user.name} (${user.email})` : ''}`}
                                        </option>
                                    )
                                })}
                            </select>
                            {users.length === 0 && (
                                <p className="text-xs text-amber-600">Belum ada data user tersedia untuk dipilih.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Nama Tenant</Label>
                            <Input value={formData.tenant_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tenant_name: e.target.value })} placeholder="Nama Toko / Perusahaan" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nama PIC</Label>
                            <Input value={formData.pic} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, pic: e.target.value })} placeholder="Nama Penanggung Jawab" />
                        </div>
                        <div className="space-y-2">
                            <Label>Pilih Paket Membership</Label>
                            <select
                                className="w-full border rounded-md p-2 text-sm"
                                value={formData.membership_id}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, membership_id: parseInt(e.target.value) || 0 })}
                            >
                                <option value={0}>-- Pilih Paket --</option>
                                {packages.map((pkg) => (
                                    <option key={pkg.id} value={pkg.id}>{pkg.package_name} - (Rp {pkg.price.toLocaleString()})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>Konfirmasi Hapus</DialogTitle><DialogDescription>Anda yakin ingin menghapus tenant ini dari sistem?</DialogDescription></DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}