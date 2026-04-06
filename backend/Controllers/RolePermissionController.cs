using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Helpers;
using backend.Models;
using backend.DTOs.RolePermission.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/role-permission")]
    public class RolePermissionController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public RolePermissionController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<RolePermission>>> GetAllRolePermission()
        {
            try
            {
                var query = "SELECT * FROM role_permissions ORDER BY id DESC";
                var result = await _db.ToModel<RolePermission>(_config, query);

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
                        message = "Tidak ada data role permission yang ditemukan!"
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
        [HttpPost("create-role-permission")]
        public async Task<ActionResult<RolePermission>> CreateRolePermission([FromBody] RolePermissionCreateDto rolePermissionDto)
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

                var checkRole = $"SELECT id FROM roles WHERE id = {rolePermissionDto.role_id}";
                var roleExists = await _db.ToSingleModel<Role>(_config, checkRole);

                if (roleExists == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Role dengan id {rolePermissionDto.role_id} tidak ditemukan!"
                    });
                }

                var checkPermission = $"SELECT id FROM permissions WHERE id = {rolePermissionDto.permission_id}";
                var permissionExists = await _db.ToSingleModel<Permission>(_config, checkPermission);

                if (permissionExists == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Permission dengan id {rolePermissionDto.permission_id} tidak ditemukan!"
                    });
                }

                var checkExists = $"SELECT id FROM role_permissions WHERE role_id = {rolePermissionDto.role_id} AND permission_id = {rolePermissionDto.permission_id}";
                var exists = await _db.ToSingleModel<RolePermission>(_config, checkExists);

                if (exists != null)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Role permission sudah ada!"
                    });
                }

                var getUserLogin = User.Identity?.Name;

                var query = $"INSERT INTO role_permissions (granted_by, role_id, permission_id, granted_at) VALUES ('{getUserLogin}' ,{rolePermissionDto.role_id}, {rolePermissionDto.permission_id}, NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Role permission berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan role permission!"
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
        [HttpPut("update-role-permission/{id}")]
        public async Task<ActionResult<RolePermission>> UpdateRolePermission(int id, [FromBody] RolePermissionUpdateDto rolePermissionDto)
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

                var checkQuery = $"SELECT id FROM role_permissions WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<RolePermission>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Role permission dengan id {id} tidak ditemukan!"
                    });
                }

                var checkRole = $"SELECT id FROM roles WHERE id = {rolePermissionDto.role_id}";
                var roleExists = await _db.ToSingleModel<Role>(_config, checkRole);

                if (roleExists == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Role dengan id {rolePermissionDto.role_id} tidak ditemukan!"
                    });
                }

                var checkPermission = $"SELECT id FROM permissions WHERE id = {rolePermissionDto.permission_id}";
                var permissionExists = await _db.ToSingleModel<Permission>(_config, checkPermission);

                if (permissionExists == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Permission dengan id {rolePermissionDto.permission_id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE role_permissions SET role_id = {rolePermissionDto.role_id}, permission_id = {rolePermissionDto.permission_id}, updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Role permission berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate role permission!"
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
        [HttpDelete("delete-role-permission/{id}")]
        public async Task<ActionResult> DeleteRolePermission(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM role_permissions WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<RolePermission>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Role permission dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM role_permissions WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Role permission berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus role permission!"
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