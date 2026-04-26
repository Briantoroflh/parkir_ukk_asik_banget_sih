'use client'

import React, { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import { Datatable } from '../../../components/datatable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle, CreditCard, PowerOff } from 'lucide-react'
import RfidCardService, { type RfidCard, type RfidCardCreateDto } from '../../../services/RfidCardService'

export default function RfidCardPage() {
    const [cards, setCards] = useState<RfidCard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [editingCard, setEditingCard] = useState<RfidCard | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [showVehicleSelect, setShowVehicleSelect] = useState(false)
    const [showTenantSelect, setShowTenantSelect] = useState(false)
    const [showEmployeeSelect, setShowEmployeeSelect] = useState(false)

    const [vehicleOptions, setVehicleOptions] = useState<any[]>([])
    const [employeeOptions, setEmployeeOptions] = useState<any[]>([])
    const [tenantOptions, setTenantOptions] = useState<any[]>([])

    const [isScanning, setIsScanning] = useState(true); // Default true saat modal dibuka
    const [scannedUid, setScannedUid] = useState("");

    // Form states
    const [formData, setFormData] = useState<RfidCardCreateDto>({
        card_uid: '',
        vehicle_id: null,
        is_guest: false,
        is_member: true,
        employee_id: null,
        pic_tenant_id: null
    })

    const fetchCards = async () => {
        try {
            setLoading(true)
            const res = await RfidCardService.GetAllRfidCard()
            if (res.status) {
                setCards(res.data || [])
            } else {
                setError(res.message)
            }
        } catch (err) {
            setError('Gagal memuat data kartu RFID')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCards()
    }, [])

    useEffect(() => {
        if (isModalOpen) {
            setIsScanning(true);
            setScannedUid("");
            setShowVehicleSelect(!!formData.vehicle_id)
            setShowEmployeeSelect(!!formData.employee_id)
            setShowTenantSelect(!!formData.pic_tenant_id)

            if (editingCard) {
                setIsScanning(false);
            }
        }
    }, [isModalOpen, FormData, editingCard])

    const resetForm = () => {
        setFormData({
            card_uid: '',
            vehicle_id: null,
            is_guest: false,
            is_member: true,
            employee_id: null,
            pic_tenant_id: null
        })
        setEditingCard(null)
    }

    const handleSubmit = async () => {
        try {
            if (!formData.card_uid) {
                setError('Card UID wajib diisi!')
                return
            }

            setIsSubmitting(true)
            const res = editingCard
                ? await RfidCardService.UpdateRfidCard(editingCard.id, formData)
                : await RfidCardService.CreateRfidCard(formData)

            if (res.status) {
                setSuccess(res.message)
                setIsModalOpen(false)
                fetchCards()
                resetForm()
            } else {
                setError(res.message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeactivate = async (id: number) => {
        if (!confirm('Nonaktifkan kartu ini?')) return
        const res = await RfidCardService.DeactivateCard(id)
        if (res.status) {
            setSuccess('Kartu dinonaktifkan')
            fetchCards()
        }
    }

    const handleDelete = async () => {
        if (!deleteTargetId) return
        setIsSubmitting(true)
        const res = await RfidCardService.DeleteRfidCard(deleteTargetId)
        if (res.status) {
            setSuccess('Kartu berhasil dihapus')
            setIsDeleteConfirmOpen(false)
            fetchCards()
        }
        setIsSubmitting(false)
    }

    const handleRfidScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (scannedUid.length > 3) {
                setFormData({ ...formData, card_uid: scannedUid });
                setIsScanning(false); // Pindah ke tahap konfigurasi
            }
        }
    }

    const columns: ColumnDef<RfidCard>[] = [
        {
            accessorKey: 'card_uid',
            header: 'UID Kartu',
            cell: ({ row }) => <code className="bg-slate-100 px-2 py-1 rounded text-blue-700 font-bold">{row.getValue('card_uid')}</code>,
        },
        {
            header: 'Tipe Kartu',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {row.original.is_member && <Badge variant="default">Member</Badge>}
                    {row.original.is_guest && <Badge variant="outline">Guest</Badge>}
                </div>
            ),
        },
        {
            accessorKey: 'deactivated_at',
            header: 'Status',
            cell: ({ row }) => (
                row.original.deactivated_by == null
                    ? <Badge className="bg-green-500">Aktif</Badge>
                    : <Badge variant="destructive">Nonaktif</Badge> 
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    {row.original.deactivated_by == null && (
                        <Button variant="outline" size="sm" onClick={() => handleDeactivate(row.original.id)} title="Deactivate">
                            <PowerOff className="w-4 h-4 text-orange-500" />
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => {
                        setEditingCard(row.original)
                        setFormData({
                            card_uid: row.original.card_uid,
                            vehicle_id: row.original.vehicle_id || null,
                            is_guest: row.original.is_guest,
                            is_member: row.original.is_member,
                            employee_id: row.original.employee_id || null,
                            pic_tenant_id: row.original.pic_tenant_id || null
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
                        <h1 className="text-3xl font-bold tracking-tight">RFID Card Management</h1>
                        <p className="text-gray-500">Registrasi dan kelola akses kartu RFID</p>
                    </div>
                    <Button onClick={() => { resetForm(); setIsModalOpen(true) }} className="gap-2">
                        <Plus className="w-4 h-4" /> Daftarkan Kartu
                    </Button>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex gap-3 items-center"><AlertCircle className="w-5 h-5" /> {error}</div>}
                {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex gap-3 items-center"><CheckCircle className="w-5 h-5" /> {success}</div>}

                <Card>
                    <CardHeader><CardTitle>Daftar Kartu Terdaftar</CardTitle></CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-48 flex items-center justify-center text-gray-500">Memuat data kartu...</div>
                        ) : (
                            <Datatable columns={columns} data={cards} searchColumn="card_uid" searchPlaceholder="Cari UID Kartu..." />
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingCard ? 'Update Kartu' : 'Registrasi Kartu Baru'}</DialogTitle>
                        <DialogDescription>Masukkan UID kartu dan tentukan tipe aksesnya.</DialogDescription>
                    </DialogHeader>

                    {isScanning ? (
                        <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>
                                <div className="relative bg-blue-600 p-6 rounded-full">
                                    <CreditCard className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="font-bold text-lg">Siap Membaca Kartu</h3>
                                <p className="text-sm text-muted-foreground">Silakan tempelkan kartu RFID pada reader...</p>
                            </div>

                            {/* Hidden Input untuk menangkap focus dari RFID Reader */}
                            <Input
                                autoFocus
                                className="opacity-0 w-0 h-0 absolute"
                                value={scannedUid}
                                onChange={(e) => setScannedUid(e.target.value)}
                                onKeyDown={handleRfidScan}
                            />
                        </div>
                    ) : (
                            <div className="space-y-4 py-2 animate-in slide-in-from-right-5 duration-300">
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-800">Kartu Terdeteksi:</span>
                                    </div>
                                    <code className="text-sm font-mono font-bold">{formData.card_uid}</code>
                                </div>

                                {/* Switch Utama: Member vs Guest */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50">
                                        <Label className="text-xs font-semibold">Member</Label>
                                        <Switch
                                            checked={formData.is_member}
                                            onCheckedChange={(val) => {
                                                setFormData({ ...formData, is_member: val, is_guest: !val });
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50">
                                        <Label className="text-xs font-semibold">Guest</Label>
                                        <Switch
                                            checked={formData.is_guest}
                                            onCheckedChange={(val) => {
                                                setFormData({ ...formData, is_guest: val, is_member: !val });
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* --- KONDISI: Relasi Data Hanya Muncul Jika Member --- */}
                                {formData.is_member ? (
                                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-background px-2 text-blue-600 font-medium">Relasi Data Member (Opsional)</span>
                                            </div>
                                        </div>

                                        {/* Bagian Opsional: Vehicle */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm">Hubungkan ke Kendaraan</Label>
                                                <Switch
                                                    checked={showVehicleSelect}
                                                    onCheckedChange={(val) => {
                                                        setShowVehicleSelect(val);
                                                        if (!val) setFormData({ ...formData, vehicle_id: null });
                                                    }}
                                                />
                                            </div>
                                            {showVehicleSelect && (
                                                <select
                                                    className="w-full p-2 text-sm border rounded-md bg-background"
                                                    value={formData.vehicle_id || ''}
                                                    onChange={(e) => setFormData({ ...formData, vehicle_id: parseInt(e.target.value) || null })}
                                                >
                                                    <option value="">-- Pilih Kendaraan --</option>
                                                    {vehicleOptions.map(v => <option key={v.id} value={v.id}>{v.plate_number}</option>)}
                                                </select>
                                            )}
                                        </div>

                                        {/* Bagian Opsional: Employee */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm">Hubungkan ke Karyawan</Label>
                                                <Switch
                                                    checked={showEmployeeSelect}
                                                    onCheckedChange={(val) => {
                                                        setShowEmployeeSelect(val);
                                                        if (!val) setFormData({ ...formData, employee_id: null });
                                                    }}
                                                />
                                            </div>
                                            {showEmployeeSelect && (
                                                <select
                                                    className="w-full p-2 text-sm border rounded-md bg-background"
                                                    value={formData.employee_id || ''}
                                                    onChange={(e) => setFormData({ ...formData, employee_id: parseInt(e.target.value) || null })}
                                                >
                                                    <option value="">-- Pilih Karyawan --</option>
                                                    {employeeOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.employee_name}</option>)}
                                                </select>
                                            )}
                                        </div>

                                        {/* Bagian Opsional: PIC Tenant */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm">Hubungkan ke PIC Tenant</Label>
                                                <Switch
                                                    checked={showTenantSelect}
                                                    onCheckedChange={(val) => {
                                                        setShowTenantSelect(val);
                                                        if (!val) setFormData({ ...formData, pic_tenant_id: null });
                                                    }}
                                                />
                                            </div>
                                            {showTenantSelect && (
                                                <select
                                                    className="w-full p-2 text-sm border rounded-md bg-background"
                                                    value={formData.pic_tenant_id || ''}
                                                    onChange={(e) => setFormData({ ...formData, pic_tenant_id: parseInt(e.target.value) || null })}
                                                >
                                                    <option value="">-- Pilih PIC Tenant --</option>
                                                    {tenantOptions.map(t => <option key={t.id} value={t.id}>{t.tenant_name}</option>)}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Tampilan Info Jika Guest Terpilih */
                                    <div className="p-4 border border-dashed rounded-lg bg-orange-50/50 text-center animate-in slide-in-from-bottom-2">
                                        <p className="text-xs text-orange-600 font-medium">
                                            Kartu Guest tidak memerlukan relasi data master.
                                        </p>
                                    </div>
                                )}

                                <DialogFooter className="pt-4">
                                    <Button variant="outline" onClick={() => setIsScanning(true)}>Scan Ulang</Button>
                                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? 'Memproses...' : 'Simpan Kartu'}
                                    </Button>
                                </DialogFooter>
                            </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Kartu?</DialogTitle>
                        <DialogDescription>Kartu akan dihapus permanen dari database sistem.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>Hapus Permanen</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}