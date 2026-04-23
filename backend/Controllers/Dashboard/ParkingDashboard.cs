using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Dashboard
{
    [ApiController]
    [Route("api/dashboard")]
    public class ParkingDashboard : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public ParkingDashboard(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        /// <summary>
        /// API 1: Get Traffic Parking - Menampilkan traffic parkir keseluruhan zona dan gate
        /// Query param: startDate, endDate (format: yyyy-MM-dd, default: hari ini)
        /// </summary>
        [Authorize]
        [HttpGet("traffic-parking")]
        public async Task<IActionResult> GetTrafficParking([FromQuery] string? startDate, [FromQuery] string? endDate)
        {
            try
            {
                var filterStartDate = string.IsNullOrEmpty(startDate) ? DateTime.Now.Date : DateTime.ParseExact(startDate, "yyyy-MM-dd", null);
                var filterEndDate = string.IsNullOrEmpty(endDate) ? DateTime.Now.Date.AddDays(1) : DateTime.ParseExact(endDate, "yyyy-MM-dd", null).AddDays(1);

                var query = $@"
                    SELECT 
                        z.id as zone_id,
                        z.name as zone_name,
                        g.id as gate_id,
                        g.name as gate_name,
                        g.gate_type,
                        COUNT(t.id) as total_entry,
                        COUNT(DISTINCT t.member_vehicle_id) as unique_vehicles
                    FROM transactions t
                    INNER JOIN gates g ON t.entry_gate_id = g.id
                    INNER JOIN zones z ON g.zone_id = z.id
                    WHERE DATE(t.entry_at) >= '{filterStartDate:yyyy-MM-dd}' 
                        AND DATE(t.entry_at) < '{filterEndDate:yyyy-MM-dd}' 
                        AND t.entry_at IS NOT NULL
                    GROUP BY z.id, z.name, g.id, g.name, g.gate_type
                    ORDER BY z.id, g.id
                ";

                var result = await _db.QueryRelation(_config, query);

                if (result != null && result.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data traffic parkir ditemukan!",
                        data = result
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Tidak ada traffic parkir hari ini!",
                        data = new List<object>()
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Terjadi kesalahan server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// API 2: Get Total Tap In Today - Menampilkan total tap in parkir hari ini
        /// </summary>
        [Authorize]
        [HttpGet("tap-in-today")]
        public async Task<IActionResult> GetTapInToday()
        {
            try
            {
                var today = DateTime.Now.Date;

                var query = $@"
                    SELECT 
                        COUNT(t.id) as total_tap_in,
                        COUNT(DISTINCT DATE(t.entry_at)) as days_recorded
                    FROM transactions t
                    WHERE DATE(t.entry_at) = '{today:yyyy-MM-dd}'
                        AND t.entry_at IS NOT NULL
                ";

                var result = await _db.QueryRelation(_config, query);

                if (result != null && result.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data tap in hari ini ditemukan!",
                        data = result.FirstOrDefault()
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Tidak ada tap in hari ini!",
                        data = new { total_tap_in = 0, days_recorded = 0 }
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Terjadi kesalahan server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// API 3: Get Vehicle Entry Today - Menampilkan total entry motor dan mobil masuk
        /// Query param: startDate, endDate (format: yyyy-MM-dd, default: hari ini)
        /// Returns: 2 data entries (Motor id=1, Mobil id=2)
        /// </summary>
        [Authorize]
        [HttpGet("vehicle-entry-tracking")]
        public async Task<IActionResult> GetVehicleEntry([FromQuery] string? startDate, [FromQuery] string? endDate)
        {
            try
            {
                var filterStartDate = string.IsNullOrEmpty(startDate) ? DateTime.Now.Date : DateTime.ParseExact(startDate, "yyyy-MM-dd", null);
                var filterEndDate = string.IsNullOrEmpty(endDate) ? DateTime.Now.Date.AddDays(1) : DateTime.ParseExact(endDate, "yyyy-MM-dd", null).AddDays(1);

                var query = $@"
                    SELECT 
                        vt.name as vehicle_type,
                        COUNT(t.id) as total_entry
                    FROM transactions t
                    INNER JOIN vehicle_types vt ON t.vehicle_type_id = vt.id
                    WHERE DATE(t.entry_at) >= '{filterStartDate:yyyy-MM-dd}' 
                        AND DATE(t.entry_at) < '{filterEndDate:yyyy-MM-dd}'
                        AND t.entry_at IS NOT NULL
                        AND vt.id IN (1, 2)
                    GROUP BY vt.id, vt.name, vt.minimum_fee
                    ORDER BY vt.id
                ";

                var result = await _db.QueryRelation(_config, query);

                if (result != null && result.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data total entry motor dan mobil ditemukan!",
                        data = result
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Tidak ada kendaraan masuk dalam periode tersebut!",
                        data = new List<object>()
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Terjadi kesalahan server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// API 4: Get Active Parking Today - Ticket parkir yang masih active dan belum dibayar
        /// Query param: startDate, endDate (format: yyyy-MM-dd, default: hari ini)
        /// </summary>
        [Authorize]
        [HttpGet("active-parking-tracking")]
        public async Task<IActionResult> GetActiveParkingToday([FromQuery] string? startDate, [FromQuery] string? endDate)
        {
            try
            {
                var filterStartDate = string.IsNullOrEmpty(startDate) ? DateTime.Now.Date : DateTime.ParseExact(startDate, "yyyy-MM-dd", null);
                var filterEndDate = string.IsNullOrEmpty(endDate) ? DateTime.Now.Date.AddDays(1) : DateTime.ParseExact(endDate, "yyyy-MM-dd", null).AddDays(1);

                var query = $@"
                    SELECT 
                        t.id as transaction_id,
                        t.transaction_code,
                        vt.name AS vehicle_type,
                        z.name AS zone,
                        g.name as gate_name,
                        t.entry_at,
                        t.status,
                        t.calculated_fee
                    FROM transactions t
                    LEFT JOIN vehicle_types vt ON t.vehicle_type_id = vt.id
                    INNER JOIN zones z ON t.zone_id = z.id
                    LEFT JOIN fee_configs fg ON t.fee_config_id = fg.id
                    INNER JOIN gates g ON t.entry_gate_id = g.id
                    WHERE DATE(t.entry_at) >= '{filterStartDate:yyyy-MM-dd}' 
                        AND DATE(t.entry_at) < '{filterEndDate:yyyy-MM-dd}'
                        AND t.status = 'active'
                        AND t.calculated_fee IS NULL
                    ORDER BY t.entry_at DESC
                ";

                var result = await _db.QueryRelation(_config, query);

                if (result != null && result.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data parkir aktif hari ini ditemukan!",
                        data = result
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Tidak ada parkir aktif hari ini!",
                        data = new List<object>()
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Terjadi kesalahan server: " + ex.Message
                });
            }
        }

        /// <summary>
        /// API 5: Get Inactive Parking Today - Ticket parkir yang sudah dibayar dan tidak lagi active
        /// Query param: startDate, endDate (format: yyyy-MM-dd, default: hari ini)
        /// </summary>
        [Authorize]
        [HttpGet("inactive-parking-tracking")]
        public async Task<IActionResult> GetInactiveParkingToday([FromQuery] string? startDate, [FromQuery] string? endDate)
        {
            try
            {
                var filterStartDate = string.IsNullOrEmpty(startDate) ? DateTime.Now.Date : DateTime.ParseExact(startDate, "yyyy-MM-dd", null);
                var filterEndDate = string.IsNullOrEmpty(endDate) ? DateTime.Now.Date.AddDays(1) : DateTime.ParseExact(endDate, "yyyy-MM-dd", null).AddDays(1);

                var query = $@"
                    SELECT 
                        t.id as transaction_id,
                        t.transaction_code,
                        vt.name as vehicle_type,
                        z.name as zone_name,
                        g.name as gate_name,
                        t.entry_at,
                        t.exit_at,
                        t.status,
                        t.calculated_fee,
                        t.exit_method
                    FROM transactions t
                    LEFT JOIN vehicle_types vt ON t.vehicle_type_id = vt.id
                    INNER JOIN zones z ON t.zone_id = z.id
                    INNER JOIN gates g ON t.exit_gate_id = g.id
                    WHERE DATE(t.entry_at) >= '{filterStartDate:yyyy-MM-dd}' 
                        AND DATE(t.entry_at) < '{filterEndDate:yyyy-MM-dd}'
                        AND t.entry_at IS NOT NULL
                        AND t.status = 'paid'
                    ORDER BY t.entry_at DESC
                ";

                var result = await _db.QueryRelation(_config, query);

                if (result != null && result.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data parkir tidak aktif (sudah dibayar) hari ini ditemukan!",
                        data = result
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Tidak ada parkir yang sudah dibayar hari ini!",
                        data = new List<object>()
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Terjadi kesalahan server: " + ex.Message
                });
            }
        }
    }
}