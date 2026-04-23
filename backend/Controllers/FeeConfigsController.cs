using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.DTOs.FeeConfig;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/fee-config")]
    public class FeeConfigsController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public FeeConfigsController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<FeeConfig>>> GetAllFeeConfig()
        {
            try
            {
                var query = "SELECT * FROM fee_configs ORDER BY id DESC";
                var result = await _db.ToModel<FeeConfig>(_config, query);

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
                        message = "Tidak ada data fee config yang ditemukan!"
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
        [HttpPost("create-fee-config")]
        public async Task<ActionResult<FeeConfig>> CreateFeeConfig([FromBody] FeeConfigCreateDto dto)
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

                var user = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var query = $"INSERT INTO fee_configs (zone_id, vehicle_type_id, created_by, base_fee, grace_period_minutes, is_active, effective_from, effective_until, created_at) VALUES ({dto.zone_id}, {dto.vehicle_type_id}, {user}, {dto.base_fee}, {dto.grace_period_minutes}, TRUE, '{dto.effective_from:yyyy-MM-dd HH:mm:ss}', '{(dto.effective_until.HasValue ? dto.effective_until.Value.ToString("yyyy-MM-dd HH:mm:ss") : null)}', NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Fee config berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan fee config!"
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
        [HttpPut("update-fee-config/{id}")]
        public async Task<ActionResult<FeeConfig>> UpdateFeeConfig(int id, [FromBody] FeeConfigUpdateDto dto)
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

                var checkQuery = $"SELECT id FROM fee_configs WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<FeeConfig>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Fee config dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE fee_configs SET zone_id = {dto.zone_id}, vehicle_type_id = {dto.vehicle_type_id}, base_fee = {dto.base_fee}, grace_period_minutes = {dto.grace_period_minutes}, is_active = {(dto.is_active ? 1 : 0)}, effective_from = '{dto.effective_from:yyyy-MM-dd HH:mm:ss}', effective_until = '{(dto.effective_until.HasValue ? dto.effective_until.Value.ToString("yyyy-MM-dd HH:mm:ss") : null)}', updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Fee config berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate fee config!"
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
        [HttpDelete("delete-fee-config/{id}")]
        public async Task<ActionResult> DeleteFeeConfig(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM fee_configs WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<FeeConfig>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Fee config dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM fee_configs WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Fee config berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus fee config!"
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