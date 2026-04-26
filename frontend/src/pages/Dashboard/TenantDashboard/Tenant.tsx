'use client'

import React, { useState, useEffect } from 'react'
import LayoutPage from '../../../layouts/LayoutPage'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog" // Pastikan sudah install shadcn dialog
import {
    Building2,
    User,
    Calendar,
    CreditCard,
    AlertCircle,
    Clock,
    Wallet,
    ArrowRight,
    CircleDollarSign,
    Loader2,
    QrCode
} from 'lucide-react'
import TenantMemberService, { type TenantMember } from '../../../services/TenantMemberService'

export default function Tenant() {
    const { user } = useAuth()
    const [tenantData, setTenantData] = useState<TenantMember[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // State untuk Modal Pembayaran
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [qrUrl, setQrUrl] = useState<string | null>(null)
    const [selectedTenant, setSelectedTenant] = useState<TenantMember | null>(null)

    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)

    const fetchTenantInfo = async () => {
        if (!user?.id) return
        try {
            const response = await TenantMemberService.GetTenantByUserId(user.id)
            if (response.status && response.data) {
                setTenantData(response.data)
            } else {
                setError(response.message || "Data membership tidak ditemukan.")
            }
        } catch (err) {
            setError("Gagal memuat data tenant.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTenantInfo()
        const interval = setInterval(async () => {
            if (tenantData.length > 0) {
                for (const tenant of tenantData) {
                    await TenantMemberService.CheckStatusDue(tenant.id)
                }
                fetchTenantInfo()
            }
        }, 60)
        return () => clearInterval(interval)
    }, [user, tenantData.length])

    useEffect(() => {
        let statusInterval: number;

        // Hanya jalankan polling jika modal buka, ada QR, dan ada Order ID
        if (isModalOpen && qrUrl && currentOrderId && selectedTenant) {
            statusInterval = setInterval(async () => {
                try {
                    const response = await TenantMemberService.CheckStatusPaymentMidtrans(currentOrderId);

                    // Parsing data status (sesuai format JSON Midtrans di field 'data')
                    const midtransStatus = typeof response.data?.content === 'string'
                        ? JSON.parse(response.data.content)
                        : response.data;

                    // 'settlement' berarti pembayaran berhasil di Midtrans
                    if (midtransStatus.transaction_status === 'settlement' ||
                        midtransStatus.transaction_status === 'capture') {

                        // Berhenti polling agar tidak memanggil aktivasi berkali-kali
                        clearInterval(statusInterval);

                        const activationRes = await TenantMemberService.ActivateMembership(selectedTenant.id);

                        if (activationRes.status) {

                            // 4. Cleanup & Refresh UI
                            setIsModalOpen(false);
                            setCurrentOrderId(null);
                            setQrUrl(null);
                            fetchTenantInfo();
                        } else {
                            console.log("failed");
                        }
                    }
                } catch (err) {
                    console.error("Error polling status:", err);
                }
            }, 5000); // Cek setiap 5 detik
        }

        return () => {
            if (statusInterval) clearInterval(statusInterval);
        };
    }, [isModalOpen, qrUrl, currentOrderId]);

    // Fungsi Handler Bayar
    const handlePayment = async (tenant: TenantMember) => {
        setSelectedTenant(tenant)
        setIsModalOpen(true)
        setPaymentLoading(true)
        setQrUrl(null)

        const newOrderId = `INV-${tenant.membership_id}-${Date.now()}`;
        setCurrentOrderId(newOrderId);

        try {
            // Kita asumsikan order_id menggunakan membership_id + timestamp agar unik
            const dto = {
                order_id: newOrderId,
                gross_amount: tenant.total_bill
            }

            const response = await TenantMemberService.MembershipPaymentMidtrans(dto)

            console.log(response);
            
            const midtransData = typeof response.data.content === 'string'
                ? JSON.parse(response.data.content)
                : response.data.content;

            const qrAction = midtransData.actions?.find(
                (action: any) => action.name === 'generate-qr-code'
            );

            if (qrAction && qrAction.url) {
                
                setQrUrl(qrAction.url)
            } else {
                setIsModalOpen(false)
            }
        } catch (err) {
            setIsModalOpen(false)
        } finally {
            setPaymentLoading(false)
        }
    }

    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <LayoutPage>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Membership Saya</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola tagihan dan pantau masa aktif unit Anda.
                    </p>
                </div>

                {/* Grid Tenant Cards */}
                {loading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tenantData.map((tenant) => (
                            <Card key={tenant.id} className={`overflow-hidden border-l-4 ${tenant.status_membership.toLowerCase() === 'due' || tenant.status_membership.toLowerCase() === "suspended" ? 'border-l-red-500' : 'border-l-primary'}`}>
                                <CardHeader className="bg-muted/30">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Building2 className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{tenant.tenant_name}</CardTitle>
                                                <CardDescription>ID Membership: #{tenant.membership_id}</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant={tenant.is_active ? "default" : "destructive"} className="px-3 py-1">
                                            {tenant.is_active ? "Aktif" : "Non-Aktif"}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    <div className="grid gap-6 md:grid-cols-3">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-sm">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-semibold">PIC Unit</p>
                                                    <p className="font-medium">{tenant.pic}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Status Pembayaran</p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`mt-1 ${tenant.status_membership.toLowerCase() === 'due' || tenant.status_membership.toLowerCase() === "suspended" ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                                                    >
                                                        {tenant.status_membership}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Mulai Sewa</p>
                                                    <p className="font-medium">{formatDate(tenant.start_at ?? "")}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <AlertCircle className={`w-4 h-4 ${tenant.status_membership.toLowerCase() === 'due' || tenant.status_membership.toLowerCase() === "suspended" ? 'text-red-500' : 'text-orange-500'}`} />
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Jatuh Tempo</p>
                                                    <p className={`font-medium ${tenant.status_membership.toLowerCase() === 'due' || tenant.status_membership.toLowerCase() === "suspended" ? 'text-red-600' : 'text-orange-600'}`}>
                                                        {formatDate(tenant.due_at ?? "")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-4 bg-muted/20 rounded-xl border">
                                            <div className="flex items-center gap-3 text-sm">
                                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                                <div className="w-full">
                                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Tagihan</p>
                                                    <p className="text-lg font-bold text-red-600">{formatIDR(tenant.total_bill)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Wallet className="w-4 h-4 text-muted-foreground" />
                                                <div className="w-full">
                                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Sudah Dibayar</p>
                                                    <p className="text-lg font-bold text-green-600">{formatIDR(tenant.total_current_payment)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {tenant.status_membership.toLowerCase() === 'due' && (
                                        <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <CircleDollarSign className="w-5 h-5 text-red-600" />
                                                <p className="text-sm text-red-800 font-medium">
                                                    Masa aktif hampir habis. Segera lakukan pelunasan tagihan.
                                                </p>
                                            </div>
                                            <Button
                                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white gap-2"
                                                onClick={() => handlePayment(tenant)}
                                            >
                                                Bayar Sekarang <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal QRIS Midtrans */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            Pembayaran QRIS
                        </DialogTitle>
                        <DialogDescription>
                            Silakan scan kode QR di bawah ini melalui aplikasi pembayaran pilihan Anda (Gopay, OVO, Dana, dll).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                        {paymentLoading ? (
                            <div className="flex flex-col items-center gap-2 py-10">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-sm text-muted-foreground">Menyiapkan kode QR...</p>
                            </div>
                        ) : qrUrl ? (
                            <>
                                <div className="bg-white p-4 rounded-xl border shadow-sm">
                                    <img
                                        src={qrUrl}
                                        alt="QRIS Code"
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Total Pembayaran</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {selectedTenant ? formatIDR(selectedTenant.total_bill) : '-'}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 animate-pulse">
                                    Menunggu Pembayaran
                                </Badge>
                            </>
                        ) : (
                            <p className="text-red-500">Gagal memuat QR Code.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </LayoutPage>
    )
}