using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.FeeTier;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/fee-tier")]
    public class FeeTiersController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public FeeTiersController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<FeeTier>>> GetAllFeeTier()
        {
            try
            {
                var query = "SELECT * FROM fee_tiers ORDER BY id DESC";
                var result = await _db.ToModel<FeeTier>(_config, query);

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
                        message = "Tidak ada data fee tier yang ditemukan!"
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
        [HttpPost("create-fee-tier")]
        public async Task<ActionResult<FeeTier>> CreateFeeTier([FromBody] FeeTierCreateDto dto)
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

                var query = $"INSERT INTO fee_tiers (fee_config_id, tier_order, duration_minutes, fee_amount, is_last_tier, created_at) VALUES ({dto.fee_config_id}, {dto.tier_order}, {dto.duration_minutes}, {dto.fee_amount}, {(dto.is_last_tier ? 1 : 0)}, NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Fee tier berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan fee tier!"
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
        [HttpPut("update-fee-tier/{id}")]
        public async Task<ActionResult<FeeTier>> UpdateFeeTier(int id, [FromBody] FeeTierUpdateDto dto)
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

                var checkQuery = $"SELECT id FROM fee_tiers WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<FeeTier>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Fee tier dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE fee_tiers SET fee_config_id = {dto.fee_config_id}, tier_order = {dto.tier_order}, duration_minutes = {dto.duration_minutes}, fee_amount = {dto.fee_amount}, is_last_tier = {(dto.is_last_tier ? 1 : 0)}, updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Fee tier berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate fee tier!"
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
        [HttpDelete("delete-fee-tier/{id}")]
        public async Task<ActionResult> DeleteFeeTier(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM fee_tiers WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<FeeTier>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Fee tier dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM fee_tiers WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Fee tier berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus fee tier!"
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