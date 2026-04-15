using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.HolidayRate;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/holiday-rate")]
    public class HolidaysRateController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public HolidaysRateController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<HolidayRate>>> GetAllHolidayRate()
        {
            try
            {
                var query = "SELECT * FROM holiday_rates ORDER BY id DESC";
                var result = await _db.ToModel<HolidayRate>(_config, query);

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
                        message = "Tidak ada data holiday rate yang ditemukan!"
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
        [HttpPost("create-holiday-rate")]
        public async Task<ActionResult<HolidayRate>> CreateHolidayRate([FromBody] HolidayRateCreateDto dto)
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

                var query = $"INSERT INTO holiday_rates (created_by, name, date_start, date_aend, rate_type, multiplier, override_fee, applies_to_zone_id, applies_to_vehicle_type_id, created_at) VALUES ('{dto.created_by}', '{dto.name}', '{dto.date_start:yyyy-MM-dd HH:mm:ss}', '{(dto.date_aend.HasValue ? dto.date_aend.Value.ToString("yyyy-MM-dd HH:mm:ss") : null)}', '{dto.rate_type}', {dto.multiplier}, {dto.override_fee}, {dto.applies_to_zone_id}, {dto.applies_to_vehicle_type_id}, NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Holiday rate berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan holiday rate!"
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
        [HttpPut("update-holiday-rate/{id}")]
        public async Task<ActionResult<HolidayRate>> UpdateHolidayRate(int id, [FromBody] HolidayRateUpdateDto dto)
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

                var checkQuery = $"SELECT id FROM holiday_rates WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<HolidayRate>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Holiday rate dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE holiday_rates SET created_by = '{dto.created_by}', name = '{dto.name}', date_start = '{dto.date_start:yyyy-MM-dd HH:mm:ss}', date_aend = '{(dto.date_aend.HasValue ? dto.date_aend.Value.ToString("yyyy-MM-dd HH:mm:ss") : null)}', rate_type = '{dto.rate_type}', multiplier = {dto.multiplier}, override_fee = {dto.override_fee}, applies_to_zone_id = {dto.applies_to_zone_id}, applies_to_vehicle_type_id = {dto.applies_to_vehicle_type_id}, updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Holiday rate berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate holiday rate!"
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
        [HttpDelete("delete-holiday-rate/{id}")]
        public async Task<ActionResult> DeleteHolidayRate(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM holiday_rates WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<HolidayRate>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Holiday rate dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM holiday_rates WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Holiday rate berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus holiday rate!"
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