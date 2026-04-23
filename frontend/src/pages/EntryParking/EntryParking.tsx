import { Camera, CreditCard } from 'lucide-react'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Webcam from 'react-webcam'
import type { EntryParkingRfidDto, EntryParkingRfidResponse, GetDeviceGateResponse } from '../../services/EntryParkingService'
import EntryParkingService from '../../services/EntryParkingService'

interface EntryParkingProps {
    uniqUrl: string
}

function EntryParkingComponent({ uniqUrl }: EntryParkingProps) {
    const rfidInputRef = useRef<HTMLInputElement>(null)
    const webcamRef = useRef<Webcam>(null)
    const intervalId = useRef<any>(null)

    // State management
    const [currentSlide, setCurrentSlide] = useState(0)
    const [cameraReady, setCameraReady] = useState(false)
    const [cameraError, setCameraError] = useState<string>('')
    const [plateText, setPlateText] = useState<string>('')

    const [vehicleType, setVehicleType] = useState<'mobil' | 'motor' | ''>('')
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

    // Handle capture image from webcam
    const handleCameraReady = useCallback(() => {
        setCameraReady(true)
        setCameraError('')
    }, [])

    const handleCameraError = useCallback((error: any) => {
        console.error('Camera error:', error)
        let errorMessage = 'Gagal mengakses kamera'

        if (error?.name === 'NotAllowedError') {
            errorMessage = 'Izin kamera ditolak. Silakan izinkan akses kamera di browser settings.'
        } else if (error?.name === 'NotFoundError') {
            errorMessage = 'Kamera tidak ditemukan di device'
        } else if (error?.name === 'NotReadableError') {
            errorMessage = 'Kamera sudah digunakan oleh aplikasi lain'
        }

        setCameraError(errorMessage)
        setCameraReady(false)
    }, [])

    // Detect vehicle type based on plate number
    const detectVehicleType = useCallback((plate: string): 'mobil' | 'motor' => {
        // Extract numbers from plate (e.g., from B12345EAW, get 12345)
        const numbersMatch = plate.match(/\d+/)
        if (!numbersMatch) return 'mobil'

        const numbersPart = numbersMatch[0]
        const firstDigit = parseInt(numbersPart.charAt(0))

        // If first digit is 1-5, it's a car (mobil)
        // If first digit is 6-9, it's a motorcycle (motor)
        return firstDigit <= 5 ? 'mobil' : 'motor'
    }, [])

    const handleCaptureImage = useCallback(async () => {
        if (!webcamRef.current) {
            setMessage('Kamera tidak siap')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        try {
            const screenshot = webcamRef.current.getScreenshot()
            if (!screenshot) {
                setMessage('Gagal mengambil screenshot')
                setMessageType('error')
                setTimeout(() => setMessage(''), 3000)
                return
            }

            // Convert base64 to blob
            const arr = screenshot.split(',')
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
            const bstr = atob(arr[1])
            const n = bstr.length
            const u8arr = new Uint8Array(n)
            for (let i = 0; i < n; i++) {
                u8arr[i] = bstr.charCodeAt(i)
            }
            const blob = new Blob([u8arr], { type: mime })

            // Create FormData
            const formData = new FormData()
            formData.append('file', blob, `capture-${Date.now()}.jpg`)

            // Send to backend
            const response = await fetch('http://127.0.0.1:8000/detect-plate', {
                method: 'POST',
                body: formData
            })

            const res = await response.json();

            console.log(res);

            // Check response status
            if (!response.ok) {
                console.error('Backend error:', res.status, res.message)
                setMessage(`${res.message || 'Backend error'}`)
                setMessageType('error')
                setTimeout(() => setMessage(''), 5000)
                return
            }

            // Check if response has content
            const contentType = response.headers.get('content-type')

            if (!contentType?.includes('application/json')) {
                console.error('Invalid content type:', contentType)
                setMessage('Error: Backend mengembalikan format yang salah')
                setMessageType('error')
                setTimeout(() => setMessage(''), 5000)
                return
            }

            if (res.status) {
                const plateNumber = res.results[0]?.plate_text || 'Tidak diketahui'
                const detectedVehicle = detectVehicleType(plateNumber)
                const vehicleLabel = detectedVehicle === 'mobil' ? '🚗 MOBIL' : '🏍️ MOTOR'

                setMessage(`✅ ${vehicleLabel} - Plat: ${plateNumber}`)
                setMessageType('success')

                // Simpan plate text dan vehicle type untuk ditampilkan
                if (res.results && res.results.length > 0) {
                    setPlateText(res.results[0].plate_text)
                    setVehicleType(detectedVehicle)
                }
            } else {
                setMessage(res.message || 'Gagal menyimpan gambar')
                setMessageType('error')
            }
            setTimeout(() => setMessage(''), 5000)
        } catch (error) {
            console.error('Capture error:', error)
            setMessage('Error: ' + (error instanceof Error ? error.message : 'Gagal capture gambar'))
            setMessageType('error')
            setTimeout(() => setMessage(''), 5000)
        }
    }, [])

    // Handle entry RFID with useCallback
    const handleEntryRfid = useCallback(async () => {
        if (!rfid.trim() || !gate.trim()) {
            setMessage('RFID dan Gate harus diisi!')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        if (!plateText.trim()) {
            setMessage('Plat nomor belum di-capture!')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        if (!vehicleType) {
            setMessage('Jenis kendaraan belum dideteksi!')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        setLoading(true)

        const dto: EntryParkingRfidDto = {
            rfid: rfid.trim(),
            plate: plateText.trim(),
            vehicle_type: vehicleType === 'mobil' ? 'Mobil' : 'Motor',
            gate: gate.trim()
        }

        const response: EntryParkingRfidResponse = await EntryParkingService.EntryRfid(dto)

        setLoading(false)
        setMessage(response.message)
        setMessageType(response.status ? 'success' : 'error')

        if (response.status) {
            // Clear RFID field
            setRfid('')
            // Reset plate display
            setPlateText('')
            setVehicleType('')
            // Re-focus RFID input untuk reader berikutnya
            rfidInputRef.current?.focus()
        }

        setTimeout(() => setMessage(''), 5000)
    }, [rfid, gate, plateText, vehicleType])

    // Handle RFID keyboard input with useCallback
    const handleRfidKeydown = useCallback((e: KeyboardEvent) => {
        // Jika Enter ditekan, berarti RFID reader selesai mengirim
        if (e.key === 'Enter') {
            e.preventDefault()

            // Cek apakah RFID sudah terbaca
            if (rfid.trim() !== '') {
                // Jika plate belum tercapture, tampilkan pesan error
                if (!plateText.trim()) {
                    setMessage('📸 Gambar belum tercapture!')
                    setMessageType('error')
                    setTimeout(() => setMessage(''), 3000)
                    // Clear RFID untuk scan berikutnya
                    setRfid('')
                    rfidInputRef.current?.focus()
                    return
                }

                // Jika vehicle type belum terdeteksi, tampilkan pesan error
                if (!vehicleType) {
                    setMessage('🚗 Jenis kendaraan belum terdeteksi!')
                    setMessageType('error')
                    setTimeout(() => setMessage(''), 3000)
                    // Clear RFID untuk scan berikutnya
                    setRfid('')
                    rfidInputRef.current?.focus()
                    return
                }

                // Jika semua data lengkap, kirim
                if (gate.trim() !== '' && !loading) {
                    handleEntryRfid()
                }
            }
            return
        }

        // Jika fokus bukan di RFID input, focus-kan dulu
        if (document.activeElement !== rfidInputRef.current) {
            rfidInputRef.current?.focus()
        }
    }, [rfid, gate, plateText, vehicleType, loading, handleEntryRfid])

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
                <h1>SELAMAT DATANG</h1>
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
                            {/* Camera Display */}
                            <div className='m-auto mb-6 w-full max-w-xs mt-8 relative'>
                                {cameraError ? (
                                    <div className='w-full h-[210px] bg-red-500 text-white rounded-lg border-2 border-white flex items-center justify-center p-4 text-center'>
                                        <div>
                                            <p className='font-semibold mb-2'>❌ {cameraError}</p>
                                            <button
                                                onClick={() => {
                                                    setCameraError('')
                                                    setCameraReady(false)
                                                }}
                                                className='mt-2 px-3 py-1 bg-white text-red-500 rounded text-sm font-semibold hover:bg-red-50'
                                            >
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </div>
                                ) : plateText ? (
                                    // Display plate result
                                    <div className='w-full h-[210px] bg-yellow-300 rounded-lg border-4 border-yellow-500 flex flex-col items-center justify-center p-4 text-center relative'>
                                        <div className='text-xl font-black text-gray-800 mb-2'>
                                            {vehicleType === 'mobil' ? 'MOBIL' : 'MOTOR'}
                                        </div>
                                        <div className='text-2xl font-black text-gray-800 tracking-widest mb-1 bg-white px-6 py-3 rounded border-4 border-gray-800'>
                                            {plateText}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setPlateText('')
                                                setVehicleType('')
                                            }}
                                            className='mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600'
                                        >
                                            Capture Ulang
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Webcam
                                            ref={webcamRef}
                                            audio={false}
                                            screenshotFormat='image/jpeg'
                                            videoConstraints={{
                                                width: 280,
                                                height: 210,
                                                facingMode: 'environment'
                                            }}
                                            onUserMedia={handleCameraReady}
                                            onUserMediaError={handleCameraError}
                                            className='w-full h-auto rounded-lg border-2 border-white'
                                        />
                                        {!cameraReady && (
                                            <div className='text-white text-sm mt-2'>⏳ Kamera sedang diinisialisasi...</div>
                                        )}

                                        {/* Capture Button - Overlay di tengah camera */}
                                        <button
                                            onClick={handleCaptureImage}
                                            disabled={!cameraReady || cameraError !== ''}
                                            className={`absolute inset-0 m-auto w-20 h-20 rounded-full font-bold text-4xl transition-all cursor-pointer border-2 border-white flex items-center justify-center ${!cameraReady || cameraError !== '' ? 'cursor-not-allowed opacity-50 text-white' : 'text-white hover:shadow-xl hover:scale-110'}`}
                                        >
                                            <Camera size={40} />
                                        </button>
                                    </>
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
                                <div className={`mb-4 mt-5 px-4 py-2 rounded-lg text-white font-semibold ${messageType === 'success' ? 'bg-green-500' : messageType === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                    }`}>
                                    {message}
                                </div>
                            )}


                            <div className='text-white font-semibold mt-6'>
                                <span>Tapin kartu anda</span>
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
export default function EntryParking() {
    const { uniqUrl } = useParams<{ uniqUrl: string }>()
    return <EntryParkingComponent uniqUrl={uniqUrl || ''} />
}
