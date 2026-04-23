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
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle, Eye, ExternalLink, Image as ImageIcon } from 'lucide-react'
import GateDeviceService, { type GateDevice, type GateDeviceCreateDto, type GateDeviceUpdateDto, type GateDeviceDetail, type GateDeviceAds } from '../../../services/GateDeviceService'
import GateService, { type Gate } from '../../../services/GateService'
import GateDeviceAdsService, { type GateDeviceAdsCreateDto } from '../../../services/GateDeviceAdsService'

const BACKEND_URL = "http://localhost:5165" // Base URL untuk akses static files

export default function GateDevicePage() {
    const [gateDevices, setGateDevices] = useState<GateDevice[]>([])
    const [gates, setGates] = useState<Gate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [isAdsModalOpen, setIsAdsModalOpen] = useState(false)
    const [editingGateDevice, setEditingGateDevice] = useState<GateDevice | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Ads Modal states
    const [selectedDevice, setSelectedDevice] = useState<GateDeviceDetail | null>(null)
    const [deviceAds, setDeviceAds] = useState<GateDeviceAds[]>([])
    const [adsLoading, setAdsLoading] = useState(false)
    const [isAddingAd, setIsAddingAd] = useState(false)
    const [adFormData, setAdFormData] = useState({
        image: '',
        imageFile: null as File | null,
        imagePreview: '',
        title: '',
        company: '',
    })

    // Form states
    const [formData, setFormData] = useState({
        gate_id: 0,
        device_type: '',
        status: true,
    })

    // ============ ADS MODAL HANDLERS ============
    const handleOpenAdsModal = async (gateDevice: GateDevice) => {
        try {
            setAdsLoading(true)
            setError(null)

            // Fetch device with ads using uniqUrl
            const response = await GateDeviceService.GetGateDeviceByUniqUrl(gateDevice.uniqUrl)

            if (response.status && response.data) {
                setSelectedDevice(response.data.device)
                setDeviceAds(response.data.ads)
                setIsAdsModalOpen(true)
                resetAdForm()
            } else {
                setError(response.message || 'Gagal mengambil data iklan')
            }
        } catch (err) {
            console.error('Error opening ads modal:', err)
            setError('Terjadi kesalahan saat membuka modal iklan')
        } finally {
            setAdsLoading(false)
        }
    }

    const handleCloseAdsModal = () => {
        setIsAdsModalOpen(false)
        setSelectedDevice(null)
        setDeviceAds([])
        resetAdForm()
    }

    const resetAdForm = () => {
        setAdFormData({
            image: '',
            imageFile: null,
            imagePreview: '',
            title: '',
            company: '',
        })
        setIsAddingAd(false)
    }

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Format file harus gambar (JPG, PNG, GIF, WebP)')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Ukuran file maksimal 5MB')
                return
            }

            setError(null)

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setAdFormData(prev => ({
                    ...prev,
                    imageFile: file,
                    imagePreview: base64String,
                    image: base64String,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAddAd = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (!selectedDevice) return

            // Validation
            if (!adFormData.imageFile) {
                setError('Pilih file gambar terlebih dahulu!')
                return
            }
            if (!adFormData.title.trim()) {
                setError('Title tidak boleh kosong!')
                return
            }
            if (!adFormData.company.trim()) {
                setError('Company tidak boleh kosong!')
                return
            }

            setIsSubmitting(true)

            // Create ad using GateDeviceAdsService with base64 image
            const createDto: GateDeviceAdsCreateDto = {
                gate_device_id: selectedDevice.id,
                image: adFormData.image, // This is the base64 string
                title: adFormData.title.trim(),
                company: adFormData.company.trim(),
            }

            const response = await GateDeviceAdsService.CreateAds(createDto)

            if (response.status) {
                setSuccess('Iklan berhasil ditambahkan!')

                // Refresh ads list
                const refreshResponse = await GateDeviceService.GetGateDeviceByUniqUrl(selectedDevice.uniqUrl)
                if (refreshResponse.status && refreshResponse.data) {
                    setDeviceAds(refreshResponse.data.ads)
                }

                resetAdForm()
            } else {
                setError(response.message || 'Gagal menambahkan iklan')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menambahkan iklan')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteAd = async (adId: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus iklan ini?')) return

        try {
            setError(null)
            setSuccess(null)
            setIsSubmitting(true)

            const response = await GateDeviceAdsService.DeleteAds(adId)

            if (response.status) {
                setSuccess('Iklan berhasil dihapus!')

                // Refresh ads list
                if (selectedDevice) {
                    const refreshResponse = await GateDeviceService.GetGateDeviceByUniqUrl(selectedDevice.uniqUrl)
                    if (refreshResponse.status && refreshResponse.data) {
                        setDeviceAds(refreshResponse.data.ads)
                    }
                }
            } else {
                setError(response.message || 'Gagal menghapus iklan')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus iklan')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Fetch all gates for dropdown
    const fetchGates = async () => {
        try {
            const response = await GateService.GetAllGate()

            if (response.status && response.data) {
                setGates(response.data)
            }
        } catch (err) {
            console.error('Error fetching gates:', err)
        }
    }

    // Fetch all gate devices
    const fetchGateDevices = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await GateDeviceService.GetAllGateDevice()

            if (response.status && response.data) {
                setGateDevices(response.data)
            } else {
                setError(response.message || 'Gagal mengambil data gate device')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data gate device')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGates()
        fetchGateDevices()
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            gate_id: 0,
            device_type: '',
            status: true,
        })
        setEditingGateDevice(null)
    }

    // Get gate name by ID
    const getGateName = (gateId: number): string => {
        const gate = gates.find(g => g.id === gateId)
        return gate?.name || 'N/A'
    }

    // Get gate type by ID
    const getGateType = (gateId: number): string => {
        const gate = gates.find(g => g.id === gateId)
        return gate?.gate_type || 'entrance'
    }

    // Handle create/update submit
    const handleSubmit = async () => {
        try {
            setError(null)
            setSuccess(null)

            if (formData.gate_id === 0) {
                setError('Pilih gate terlebih dahulu!')
                return
            }

            setIsSubmitting(true)

            if (editingGateDevice) {
                // Update
                const updateDto: GateDeviceUpdateDto = {
                    gate_id: formData.gate_id,
                    device_type: formData.device_type,
                    status: formData.status,
                }
                const response = await GateDeviceService.UpdateGateDevice(editingGateDevice.id, updateDto)

                if (response.status) {
                    setSuccess('Gate device berhasil diperbarui!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchGateDevices()
                } else {
                    setError(response.message || 'Gagal memperbarui gate device')
                }
            } else {
                // Create
                const createDto: GateDeviceCreateDto = {
                    gate_id: formData.gate_id,
                    device_type: formData.device_type,
                }
                const response = await GateDeviceService.StoreGateDevice(createDto)

                if (response.status) {
                    setSuccess('Gate device berhasil ditambahkan!')
                    setIsModalOpen(false)
                    resetForm()
                    await fetchGateDevices()
                } else {
                    setError(response.message || 'Gagal menambahkan gate device')
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

            const response = await GateDeviceService.DeleteGateDevice(deleteTargetId)

            if (response.status) {
                setSuccess('Gate device berhasil dihapus!')
                setIsDeleteConfirmOpen(false)
                setDeleteTargetId(null)
                await fetchGateDevices()
            } else {
                setError(response.message || 'Gagal menghapus gate device')
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghapus gate device')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open edit modal
    const handleEdit = (gateDevice: GateDevice) => {
        setEditingGateDevice(gateDevice)
        setFormData({
            gate_id: gateDevice.gate_id,
            device_type: gateDevice.device_type || '',
            status: gateDevice.status,
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
    const columns: ColumnDef<GateDevice>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: 'uniqUrl',
            header: 'Unique URL',
            cell: ({ row }) => {
                const gateType = getGateType(row.original.gate_id)
                const urlPath = gateType === 'entrance' ? 'entry' : 'exit'
                const url = `http://localhost:3002/${urlPath}/parking/${row.getValue('uniqUrl')}`

                return (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        {row.getValue('uniqUrl')}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )
            },
        },
        {
            accessorKey: 'gate_id',
            header: 'Gate',
            cell: ({ row }) => (
                <span className="text-sm">{getGateName(row.getValue('gate_id'))}</span>
            ),
        },
        {
            accessorKey: 'device_type',
            header: 'Tipe Device',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">{row.getValue('device_type') || '-'}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.getValue('status') ? 'default' : 'secondary'}>
                    {row.getValue('status') ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            id: 'ads',
            header: 'Iklan',
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAdsModal(row.original)}
                    className="flex items-center gap-2"
                >
                    <ImageIcon className="w-4 h-4" />
                    Lihat Iklan
                </Button>
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
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Gate Device</h1>
                        <p className="text-gray-500 mt-1">Kelola semua gate device di sistem</p>
                    </div>
                    <Button onClick={handleCreate} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Gate Device
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
                        <CardTitle>Daftar Gate Device</CardTitle>
                        <CardDescription>
                            Total gate device: {gateDevices.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Memuat data...</div>
                            </div>
                        ) : gateDevices.length === 0 ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-gray-500">Tidak ada data gate device</div>
                            </div>
                        ) : (
                            <Datatable
                                columns={columns}
                                data={gateDevices}
                                searchColumn="uniqUrl"
                                searchPlaceholder="Cari gate device..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create/Update Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingGateDevice ? 'Edit Gate Device' : 'Tambah Gate Device Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingGateDevice ? 'Perbarui informasi gate device' : 'Buat gate device baru dalam sistem'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Gate */}
                        <div className="space-y-2">
                            <Label htmlFor="gate_id" className="text-sm font-medium">
                                Gate <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.gate_id.toString()} onValueChange={(value) => setFormData({ ...formData, gate_id: parseInt(value) })}>
                                <SelectTrigger id="gate_id">
                                    <SelectValue placeholder="Pilih gate..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {gates.map((gate) => (
                                        <SelectItem key={gate.id} value={gate.id.toString()}>
                                            {gate.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Device Type */}
                        <div className="space-y-2">
                            <Label htmlFor="device_type" className="text-sm font-medium">
                                Tipe Device
                            </Label>
                            <Input
                                id="device_type"
                                placeholder="Contoh: RFID Reader, LCD Display"
                                value={formData.device_type}
                                onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                            />
                        </div>

                        {/* Status */}
                        {editingGateDevice && (
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="status"
                                        checked={formData.status}
                                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked as boolean })}
                                    />
                                    <label htmlFor="status" className="text-sm font-medium cursor-pointer">
                                        {formData.status ? 'Aktif' : 'Nonaktif'}
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Info */}
                        {editingGateDevice && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
                                <strong>Unique URL:</strong> {editingGateDevice.uniqUrl}
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
                            {isSubmitting ? 'Memproses...' : editingGateDevice ? 'Perbarui' : 'Tambahkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Gate Device</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus gate device ini? Tindakan ini tidak dapat dibatalkan.
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

            {/* Ads Management Modal */}
            <Dialog open={isAdsModalOpen} onOpenChange={setIsAdsModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Kelola Iklan Gate Device</DialogTitle>
                        <DialogDescription>
                            {selectedDevice && `Gate: ${selectedDevice.gate_name}`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Existing Ads */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Daftar Iklan</h3>

                            {adsLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="text-gray-500">Memuat data iklan...</div>
                                </div>
                            ) : deviceAds.length === 0 ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                                    <p>Belum ada iklan untuk gate device ini</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {deviceAds.map((ad) => (
                                        <Card key={ad.id} className="overflow-hidden">
                                            <div className="aspect-video bg-gray-200 overflow-hidden">
                                                <img
                                                    src={`${BACKEND_URL}/${ad.image}`}
                                                    alt={ad.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="18"%3EImage not found%3C/text%3E%3C/svg%3E'
                                                    }}
                                                />
                                            </div>
                                            <CardContent className="p-3">
                                                <p className="font-semibold text-sm truncate">{ad.title}</p>
                                                <p className="text-xs text-gray-600 truncate">{ad.company}</p>
                                                <div className="flex gap-2 mt-3">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteAd(ad.id)}
                                                        disabled={isSubmitting}
                                                        className="flex-1 flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add New Ad Form */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-3">
                                {isAddingAd ? 'Tambah Iklan Baru' : 'Tambahkan Iklan'}
                            </h3>

                            {isAddingAd ? (
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    {/* Image File Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ad_image" className="text-sm font-medium">
                                            Upload Gambar <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition">
                                            <input
                                                id="ad_image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageFileChange}
                                                disabled={isSubmitting}
                                                className="hidden"
                                            />
                                            <label htmlFor="ad_image" className="cursor-pointer">
                                                {adFormData.imageFile ? (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-gray-700">File dipilih: {adFormData.imageFile.name}</p>
                                                        <p className="text-xs text-gray-500">Ukuran: {(adFormData.imageFile.size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-gray-700">Klik untuk memilih gambar</p>
                                                        <p className="text-xs text-gray-500">Format: JPG, PNG, GIF, WebP | Maksimal 5MB</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Image Preview */}
                                    {adFormData.imagePreview && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Preview</p>
                                            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                                <img
                                                    src={adFormData.imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ad_title" className="text-sm font-medium">
                                            Judul <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="ad_title"
                                            placeholder="Masukkan judul iklan"
                                            value={adFormData.title}
                                            onChange={(e) => setAdFormData({ ...adFormData, title: e.target.value })}
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Company */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ad_company" className="text-sm font-medium">
                                            Perusahaan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="ad_company"
                                            placeholder="Masukkan nama perusahaan"
                                            value={adFormData.company}
                                            onChange={(e) => setAdFormData({ ...adFormData, company: e.target.value })}
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Form Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            onClick={resetAdForm}
                                            disabled={isSubmitting}
                                            className="flex-1"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            onClick={handleAddAd}
                                            disabled={isSubmitting}
                                            className="flex-1"
                                        >
                                            {isSubmitting ? 'Menyimpan...' : 'Simpan Iklan'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button onClick={() => setIsAddingAd(true)} className="w-full flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tambah Iklan Baru
                                </Button>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            onClick={handleCloseAdsModal}
                            disabled={isSubmitting}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}
