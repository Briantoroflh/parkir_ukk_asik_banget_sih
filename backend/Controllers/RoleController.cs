using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Helpers;
using backend.Models;
using backend.DTOs.Role.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/role")]
    public class RoleController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public RoleController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<Role>>> GetAllRole()
        {
            try
            {
                var query = "SELECT * FROM roles ORDER BY id DESC";
                var result = await _db.ToModel<Role>(_config, query);

                if (result != null)
                {
                    await Task.Delay(Random.Shared.Next(100, 500));
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
                        message = "Tidak ada data role yang ditemukan!"
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
        [HttpPost("create-role")]
        public async Task<ActionResult<Role>> CreateRole([FromBody] RoleCreateDto roleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Validasi input gagal!",
                        errors = ModelState.Values.SelectMany(v => v.Errors)
                    });
                }

                var getUserLogin = User.Identity?.Name;

                var query = $"INSERT INTO roles (created_by, name, description, created_at) VALUES ('{getUserLogin}' ,'{roleDto.name}', '{roleDto.description ?? ""}', NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Role berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan role!"
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
        [HttpPut("update-role/{id}")]
        public async Task<ActionResult<Role>> UpdateRole(int id, [FromBody] RoleUpdateDto roleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Validasi input gagal!",
                        errors = ModelState.Values.SelectMany(v => v.Errors)
                    });
                }

                var checkQuery = $"SELECT id FROM roles WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<Role>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Role dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE roles SET name = '{roleDto.name}', description = '{roleDto.description ?? ""}', updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Role berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate role!"
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
        [HttpDelete("delete-role/{id}")]
        public async Task<ActionResult> DeleteRole(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM roles WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<Role>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Role dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM roles WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Role berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus role!"
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