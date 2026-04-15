using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.GateDevice;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/gate-device")]
    public class GateDevicesController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public GateDevicesController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<GateDevice>>> GetAllGateDevice()
        {
            try
            {
                var query = "SELECT * FROM gate_devices ORDER BY id DESC";
                var result = await _db.ToModel<GateDevice>(_config, query);

                if (result != null)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data ditemukan!",
                        data = result
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Tidak ada data gate device yang ditemukan!"
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

        [Authorize]
        [HttpPost("create-gate-device")]
        public async Task<ActionResult<GateDevice>> CreateGateDevice([FromBody] GateDeviceCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Validasi gagal",
                        errors = ModelState.Values.SelectMany(v => v.Errors)
                    });
                }

                var query = $"INSERT INTO gate_devices (gate_id, device_type, status, las_ping_at, error_message, created_at) VALUES ({dto.gate_id}, '{dto.device_type ?? ""}'', {(dto.status ? 1 : 0)}, '{(dto.las_ping_at.HasValue ? dto.las_ping_at.Value.ToString("yyyy-MM-dd HH:mm:ss") : null)}', '{dto.error_message ?? ""}'', NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan gate device!"
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

        [Authorize]
        [HttpPut("update-gate-device/{id}")]
        public async Task<ActionResult<GateDevice>> UpdateGateDevice(int id, [FromBody] GateDeviceUpdateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Validasi gagal",
                        errors = ModelState.Values.SelectMany(v => v.Errors)
                    });
                }

                var checkQuery = $"SELECT id FROM gate_devices WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<GateDevice>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE gate_devices SET gate_id = {dto.gate_id}, device_type = '{dto.device_type ?? ""}'', status = {(dto.status ? 1 : 0)}, las_ping_at = '{(dto.las_ping_at.HasValue ? dto.las_ping_at.Value.ToString("yyyy-MM-dd HH:mm:ss") : null)}', error_message = '{dto.error_message ?? ""}'', updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate gate device!"
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

        [Authorize]
        [HttpDelete("delete-gate-device/{id}")]
        public async Task<ActionResult> DeleteGateDevice(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM gate_devices WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<GateDevice>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM gate_devices WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus gate device!"
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