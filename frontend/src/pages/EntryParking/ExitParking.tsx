import { CreditCard } from 'lucide-react'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import type { CheckTransactionDto, CheckTransactionResponse, ExitParkingRfidDto, ExitParkingRfidResponse, GetDeviceGateResponse } from '../../services/EntryParkingService'
import EntryParkingService from '../../services/EntryParkingService'

interface EntryParkingProps {
    uniqUrl: string
}

function EntryParkingComponent({ uniqUrl }: EntryParkingProps) {
    const rfidInputRef = useRef<HTMLInputElement>(null)
    const intervalId = useRef<any>(null)

    // State management
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slides, setSlides] = useState<Array<{ id: number, image?: string, title: string, company?: string }>>([
        { id: 1, title: 'Slide 1' },
        { id: 2, title: 'Slide 2' },
        { id: 3, title: 'Slide 3' },
    ])
    const [rfid, setRfid] = useState('')
    const [gate, setGate] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info')
    const [deviceLoading, setDeviceLoading] = useState(true)
    const [deviceError, setDeviceError] = useState('')
    const [checkTransactionData, setCheckTransactionData] = useState<CheckTransactionResponse['data'] | null>(null)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    // Fetch device data
    const fetchDeviceData = async () => {
        if (!uniqUrl) {
            setDeviceLoading(false)
            setDeviceError('uniqUrl tidak ditemukan di URL!')
            return
        }

        const response: GetDeviceGateResponse = await EntryParkingService.GetDeviceGate(uniqUrl)

        if (!response.status) {
            setDeviceLoading(false)
            setDeviceError(response.message || 'Gagal mengambil data device')
            return
        }

        // Set gate field dengan gate_id dari device
        if (response.data?.device?.gate_id) {
            setGate(String(response.data.device.gate_name))
            setDeviceLoading(false)
            setDeviceError('')

            // Set slides dari iklan yang tersedia
            if (response.data?.ads && response.data.ads.length > 0) {
                setSlides(response.data.ads)
            }
        } else {
            setDeviceLoading(false)
            setDeviceError('Data gate_id tidak ditemukan')
        }
    }

    // Handle exit RFID with useCallback
    const handleExitRfid = useCallback(async () => {
        if (!rfid.trim() || !gate.trim()) {
            setMessage('RFID dan Gate harus diisi!')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return
        }
        console.log(checkTransactionData);
        

        if (!checkTransactionData?.transaction_code) {
            setMessage('Data transaksi belum tersedia, silakan check transaksi terlebih dahulu!')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        setLoading(true)

        const dto: ExitParkingRfidDto = {
            transaction_id: checkTransactionData.transaction_code,
            calculated_fee: checkTransactionData.calculated_fee,
            gate: gate.trim()
        }

        const response: ExitParkingRfidResponse = await EntryParkingService.ExitRfid(dto)

        setLoading(false)
        setMessage(response.message)
        setMessageType(response.status ? 'success' : 'error')

        if (response.status) {
            // Clear RFID field
            setRfid('')
            setCheckTransactionData(null)
            // Re-focus RFID input untuk reader berikutnya
            rfidInputRef.current?.focus()
        } else {
            // Jika tap keluar gagal, kosongkan RFID agar siap scan ulang.
            setRfid('')
            rfidInputRef.current?.focus()
        }

        setTimeout(() => setMessage(''), 5000)
    }, [rfid, gate, checkTransactionData])

    const handleCheckTransaction = useCallback(async () => {
        if (!rfid.trim() || !gate.trim()) {
            setMessage('RFID dan Gate harus diisi!')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return false
        }

        setLoading(true)

        const dto: CheckTransactionDto = {
            rfid: rfid.trim(),
            gate: gate.trim()
        }

        const response: CheckTransactionResponse = await EntryParkingService.CheckTransaction(dto)

        setLoading(false)
        setMessage(response.message)
        setMessageType(response.status ? 'success' : 'error')

        if (response.status && response.data) {
            setCheckTransactionData(response.data)
            // Kosongkan input agar tap berikutnya benar-benar menjadi konfirmasi keluar.
            setRfid('')
            setMessage('Data transaksi ditemukan, tap kartu sekali lagi untuk keluar.')
            setMessageType('info')
            setTimeout(() => setMessage(''), 5000)
            return true
        }

        setCheckTransactionData(null)
        setRfid('')
        rfidInputRef.current?.focus()
        setTimeout(() => setMessage(''), 5000)
        return false
    }, [rfid, gate])

    // Handle RFID keyboard input with useCallback
    const handleRfidKeydown = useCallback((e: KeyboardEvent) => {
        // Jika Enter ditekan, berarti RFID reader selesai mengirim
        if (e.key === 'Enter') {
            e.preventDefault()
            if (rfid.trim() !== '' && gate.trim() !== '' && !loading) {
                if (checkTransactionData) {
                    handleExitRfid()
                } else {
                    handleCheckTransaction()
                }
            }
            return
        }

        // Jika fokus bukan di RFID input, focus-kan dulu
        if (document.activeElement !== rfidInputRef.current) {
            rfidInputRef.current?.focus()
        }
    }, [rfid, gate, loading, checkTransactionData, handleExitRfid, handleCheckTransaction])

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'rfid') {
            setRfid(value)
        } else if (name === 'gate') {
            setGate(value)
        }
    }

    // Component lifecycle - Fetch device data on mount
    useEffect(() => {
        fetchDeviceData()
    }, [uniqUrl])

    // Setup RFID keyboard listener
    useEffect(() => {
        // Auto-focus ke RFID input
        rfidInputRef.current?.focus()

        // Setup event listener untuk RFID reader
        document.addEventListener('keydown', handleRfidKeydown)

        console.log('Event listener attached:', { rfid, gate, loading })

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleRfidKeydown)
        }
    }, [handleRfidKeydown])

    // Setup carousel interval
    useEffect(() => {
        intervalId.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 3000)

        // Cleanup
        return () => {
            if (intervalId.current) clearInterval(intervalId.current)
        }
    }, [slides.length])

    // Loading state
    if (deviceLoading) {
        return (
            <div className='bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 w-full h-screen min-h-screen flex flex-col justify-center items-center'>
                <div className='text-white text-3xl font-bold'>Loading...</div>
            </div>
        )
    }

    // Error state
    if (deviceError) {
        return (
            <div className='bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 w-full h-screen min-h-screen flex flex-col justify-center items-center'>
                <div className='bg-red-500 text-white px-8 py-4 rounded-lg text-center font-semibold'>
                    <p>Error: {deviceError}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 w-full h-screen min-h-screen flex flex-col justify-center'>
            <div className='text-center text-white font-bold text-3xl m-auto'>
                <h1>KELUAR PARKIR</h1>
            </div>
            <div className='m-auto -mt-15'>
                <div className='w-300 h-190 border-4 border-dashed border-white rounded-lg overflow-hidden flex'>

                    <div className='relative w-1/2 h-full'>
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 overflow-hidden ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                {slide.image ? (
                                    // Display ads image
                                    <div className='w-full h-full flex flex-col items-center justify-center relative'>
                                        <img
                                            src={"http://localhost:5165/" + slide.image}
                                            alt={slide.title}
                                            className='w-full h-full object-cover'
                                        />
                                        {slide.company && (
                                            <div className='absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
                                                {slide.company}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Fallback to text display
                                    <div className='text-center'>
                                        <h2 className='text-4xl font-bold text-white mb-4'>{slide.title}</h2>
                                        <p className='text-white text-lg'>Konten Carousel {slide.id}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10'>
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50'
                                        }`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className='w-1/2 h-full'>
                        <div className='flex flex-col text-center justify-center h-full p-10'>
                            <div className='m-auto'>
                                {checkTransactionData && (
                                    <div className='mb-4 text-left bg-opacity-20 rounded-lg p-4 text-white'>
                                        <p className='font-bold text-2xl mb-2 text-center'>Detail Transaksi</p>
                                        <p><span className='font-semibold text-lg'>Kode:</span> {checkTransactionData.transaction_code}</p>
                                        <p><span className='font-semibold text-lg'>Jenis Kendaraan:</span> {checkTransactionData.vehicle_type}</p>
                                        <p><span className='font-semibold text-lg'>Biaya:</span> {formatCurrency(checkTransactionData.calculated_fee)}</p>
                                    </div>
                                )}
                            </div>
                            <div className='m-auto mb-6'>
                                <CreditCard size={100} color='white' />
                            </div>

                            {/* RFID Input - Hidden but functional for scanner */}
                            <input
                                ref={rfidInputRef}
                                type='text'
                                name='rfid'
                                value={rfid}
                                onChange={handleInputChange}
                                placeholder='Masukkan RFID'
                                autoComplete='off'
                                style={{
                                    position: 'absolute',
                                    left: '-9999px',
                                    top: '-9999px'
                                }}
                            />

                            {/* Gate Input */}
                            <div className='mb-6'>
                                <input
                                    type='text'
                                    name='gate'
                                    value={gate}
                                    onChange={handleInputChange}
                                    placeholder='Masukkan Gate'
                                    className='w-full px-4 py-2 rounded-lg border-2 border-white text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:bg-opacity-30 transition-all'
                                    disabled
                                />
                            </div>

                            {/* Message Alert */}
                            {message && (
                                <div className={`mb-4 px-4 py-2 rounded-lg text-white font-semibold ${messageType === 'success' ? 'bg-green-500' : messageType === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                    }`}>
                                    {message}
                                </div>
                            )}

                            <div className='text-white font-semibold mt-6'>
                                <span>{checkTransactionData ? 'Tap kartu lagi untuk konfirmasi keluar' : 'Tapin kartu anda'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='m-auto -mt-15'>
                <span className='text-white font-semibold'>Powered by Aonik Internasional</span>
            </div>
        </div>
    )
}

// Wrapper component untuk menggunakan useParams
export default function ExitParking() {
    const { uniqUrl } = useParams<{ uniqUrl: string }>()
    return <EntryParkingComponent uniqUrl={uniqUrl || ''} />
}
