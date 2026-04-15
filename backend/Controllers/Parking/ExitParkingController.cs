using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Parking.ExitParking;
using backend.Models;
using backend.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Parking
{
    [ApiController]
    [Route("api/exit-parking")]
    public class ExitParkingController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public ExitParkingController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [HttpPost]
        [Route("exit-rfid")]
        public async Task<IActionResult> ExitParkingRfid([FromBody] ExitParkingRfidDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.rfid))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "RFID tidak boleh kosong!"
                    });
                }

                if (string.IsNullOrEmpty(dto.gate))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Gate harus diisi!"
                    });
                }

                var rfidExists = $"SELECT id, card_uid, is_guest, is_member, employee_id FROM rfid_cards WHERE card_uid = '{dto.rfid}'";
                var rfidExisting = await _db.ToSingleModel<RfidCard>(_config, rfidExists);

                if (rfidExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "RFID tidak terdaftar!"
                    });
                }

                var gateExists = $"SELECT id, name, zone_id FROM gates WHERE name = '{dto.gate}'";
                var gateExisting = await _db.ToSingleModel<Gate>(_config, gateExists);

                if (gateExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Gate tidak ditemukan!"
                    });
                }

                var zoneExists = $"SELECT id, name FROM zones WHERE id = '{gateExisting.zone_id}'";
                var zoneExisting = await _db.ToSingleModel<Zone>(_config, zoneExists);

                if (zoneExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Zone tidak ditemukan!"
                    });
                }

                var gateData = $"""
                    SELECT 
                        gates.zone_id, 
                        fee_configs.zone_id,
                        fee_configs.vehicle_type_id, 
                        zones.name, 
                        zones.capacity, 
                        fee_configs.base_fee
                    FROM gates 
                    RIGHT JOIN zones ON gates.zone_id = zones.id
                    RIGHT JOIN fee_configs ON fee_configs.zone_id = zones.id
                    WHERE zones.id = {zoneExisting.id} AND gates.id = {gateExisting.id}
                """;
                var gateDataResult = await _db.QueryRelation(_config, gateData);
                var gate = gateDataResult.FirstOrDefault();

                var enteranceExists = $"SELECT id, rfid_card_id, gate_id, in_at FROM enterance_trackings WHERE rfid_card_id = {rfidExisting.id} AND gate_id = {gateExisting.id} AND out_at IS NULL";
                var enteranceExisting = await _db.ToSingleModel<EnteranceTracking>(_config, enteranceExists);

                // jika ada data enterance
                if (enteranceExisting != null)
                {
                    var currentTime = DateTime.Now;
                    DateTime inAt = Convert.ToDateTime(enteranceExisting.in_at);
                    var parkingDuration = currentTime - inAt;

                    var enteranceExitOutTime = $"UPDATE enterance_trackings SET out_at = NOW() WHERE rfid_card_id = {enteranceExisting.rfid_card_id} AND gate_id = {enteranceExisting.gate_id}";
                    var exitOutTime = await _db.ExecuteQuery(_config, enteranceExitOutTime);

                    if (rfidExisting.is_guest == true)
                    {
                        return Ok(new
                        {
                            status = true,
                            message = "Terima kasih sudah percaya kepada kami. semoga selamat sampai tujuan.",
                            data = new
                            {
                                time_in = inAt,
                                time_out = currentTime,
                                total_duration_parking = parkingDuration
                            }
                        });
                    }
                    else if (rfidExisting.is_member == true && rfidExisting.employee_id != null)
                    {
                        var employeeExists = $"SELECT id, name, role_id FROM employees WHERE id = {rfidExisting.employee_id}";
                        var employeeExisting = await _db.ToSingleModel<Employee>(_config, employeeExists);

                        if (employeeExisting == null)
                        {
                            return NotFound(new
                            {
                                status = false,
                                message = "Employee tidak terdaftar!"
                            });
                        }

                        var roleExists = $"SELECT id, name FROM roles WHERE id = {employeeExisting.role_id}";
                        var roleExisting = await _db.ToSingleModel<Role>(_config, roleExists);

                        if (roleExisting == null)
                        {
                            return NotFound(new
                            {
                                status = false,
                                message = "Role tidak diketahui!"
                            });
                        }

                        return Ok(new
                        {
                            status = true,
                            message = $"Terima kasih {roleExisting.name} sudah bekerja dengan baik. semoga selamat sampai tujuan.",
                            data = new
                            {
                                time_in = inAt,
                                time_out = currentTime,
                                total_duration_parking = parkingDuration
                            }
                        });

                    }
                    else
                    {
                        return NotFound(new
                        {
                            status = false,
                            message = "Kartu yang anda tap-in tidak diketahui!"
                        });
                    }
                }
                else
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Kartu anda mungkin belum di tap-in🤔."
                    });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = $"{ex.Message}"
                });
            }
        }

        // [HttpPost]
        // [Route("exit-ticket")]
        // private async Task<IActionResult> ExitParkingTicket()
        // {
            
        // }

        // private async Task<int> CalculateParkingFee()
        // {

        // }
    }
}