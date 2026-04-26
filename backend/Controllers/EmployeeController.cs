using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Employee;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public EmployeeController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult> GetAllEmployee()
        {
            try
            {
                // Mengambil data yang belum dihapus (deleted_at IS NULL)
                var query = "SELECT * FROM employees WHERE deleted_at IS NULL ORDER BY id DESC";
                var result = await _db.ToModel<Employee>(_config, query);

                if (result != null && result.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data karyawan ditemukan!",
                        data = result
                    });
                }

                return NotFound(new { status = false, message = "Data karyawan kosong!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Server Error: " + ex.Message });
            }
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult> CreateEmployee([FromBody] EmployeeCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { status = false, message = "Validasi gagal", errors = ModelState.Values.SelectMany(v => v.Errors) });
                }

                var query = $@"INSERT INTO employees (name, role_id, created_at, updated_at) 
                             VALUES ('{dto.name}', {dto.role_id}, NOW(), NOW())";

                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new { status = true, message = "Karyawan berhasil ditambahkan!" });
                }

                return BadRequest(new { status = false, message = "Gagal menyimpan data!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Server Error: " + ex.Message });
            }
        }

        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateEmployee(int id, [FromBody] EmployeeUpdateDto dto)
        {
            try
            {
                // Cek keberadaan data
                var checkQuery = $"SELECT id FROM employees WHERE id = {id} AND deleted_at IS NULL";
                var exists = await _db.ToSingleModel<Employee>(_config, checkQuery);

                if (exists == null)
                {
                    return NotFound(new { status = false, message = "Data tidak ditemukan!" });
                }

                var query = $@"UPDATE employees SET 
                             name = '{dto.name}', 
                             role_id = {dto.role_id}, 
                             updated_at = NOW() 
                             WHERE id = {id}";

                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new { status = true, message = "Data karyawan berhasil diupdate!" });
                }

                return BadRequest(new { status = false, message = "Gagal update data!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Server Error: " + ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteEmployee(int id)
        {
            try
            {
                // Soft delete: Update kolom deleted_at
                var query = $"UPDATE employees SET deleted_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new { status = true, message = "Data karyawan berhasil dihapus (soft delete)!" });
                }

                return NotFound(new { status = false, message = "Data tidak ditemukan atau sudah dihapus!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Server Error: " + ex.Message });
            }
        }
    }
}