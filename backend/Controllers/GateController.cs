using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Gate;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/gate")]
    public class GateController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public GateController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Gate>>> GetAllGate()
        {
            try
            {
                var query = "SELECT * FROM gates ORDER BY id DESC";
                var result = await _db.ToModel<Gate>(_config, query);

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
                        message = "Tidak ada data gate yang ditemukan!"
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
        [HttpPost("create-gate")]
        public async Task<ActionResult<Gate>> CreateGate([FromBody] GateCreateDto dto)
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

                var query = $"INSERT INTO gates (created_by, zone_id, name, gate_type, location_desc, is_active, created_at) VALUES ('{dto.created_by}', {dto.zone_id}, '{dto.name}', '{dto.gate_type}', '{dto.location_desc ?? ""}', {(dto.is_active ? 1 : 0)}, NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan gate!"
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
        [HttpPut("update-gate/{id}")]
        public async Task<ActionResult<Gate>> UpdateGate(int id, [FromBody] GateUpdateDto dto)
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

                var checkQuery = $"SELECT id FROM gates WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<Gate>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE gates SET created_by = '{dto.created_by}', zone_id = {dto.zone_id}, name = '{dto.name}', gate_type = '{dto.gate_type}', location_desc = '{dto.location_desc ?? ""}', is_active = {(dto.is_active ? 1 : 0)}, updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate gate!"
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
        [HttpDelete("delete-gate/{id}")]
        public async Task<ActionResult> DeleteGate(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM gates WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<Gate>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM gates WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus gate!"
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