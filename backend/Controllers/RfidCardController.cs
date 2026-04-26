using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.DTOs.RfidCard; // Sesuaikan dengan namespace DTO Anda
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/rfid-card")]
    public class RfidCardController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public RfidCardController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<RfidCard>>> GetAllRfidCard()
        {
            try
            {
                // Query dasar untuk mengambil data RFID Card
                var query = "SELECT * FROM rfid_cards ORDER BY id DESC";
                var result = await _db.ToModel<RfidCard>(_config, query);

                if (result != null && result.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data RFID Card ditemukan!",
                        data = result
                    });
                }

                return NotFound(new
                {
                    status = false,
                    message = "Tidak ada data RFID Card yang ditemukan!"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Terjadi kesalahan: " + ex.Message });
            }
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult> CreateRfidCard([FromBody] RfidCardCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { status = false, message = "Validasi gagal", errors = ModelState.Values.SelectMany(v => v.Errors) });
                }

                // Logic string interpolation sesuai base code Anda
                // Note: Handle null untuk foreign keys agar tidak error di SQL
                string vehicleId = dto.vehicle_id.HasValue ? dto.vehicle_id.ToString() : "NULL";
                string employeeId = dto.employee_id.HasValue ? dto.employee_id.ToString() : "NULL";
                string tenantId = dto.pic_tenant_id.HasValue ? dto.pic_tenant_id.ToString() : "NULL";

                var query = $@"INSERT INTO rfid_cards 
                             (card_uid, vehicle_id, is_guest, is_member, employee_id, pic_tenant_id, created_at) 
                             VALUES 
                             ('{dto.card_uid}', {vehicleId}, {(dto.is_guest == true ? 1 : 0)}, {(dto.is_member == true ? 1 : 0)}, {employeeId}, {tenantId}, NOW())";

                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new { status = true, message = "RFID Card berhasil ditambahkan!" });
                }

                return StatusCode(500, new { status = false, message = "Gagal menambahkan RFID Card!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Terjadi kesalahan: " + ex.Message });
            }
        }

        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateRfidCard(int id, [FromBody] RfidCardUpdateDto dto)
        {
            try
            {
                var checkQuery = $"SELECT id FROM rfid_cards WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<RfidCard>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new { status = false, message = $"RFID Card dengan id {id} tidak ditemukan!" });
                }

                string vehicleId = dto.vehicle_id.HasValue ? dto.vehicle_id.ToString() : "NULL";
                string employeeId = dto.employee_id.HasValue ? dto.employee_id.ToString() : "NULL";
                string tenantId = dto.pic_tenant_id.HasValue ? dto.pic_tenant_id.ToString() : "NULL";

                var query = $@"UPDATE rfid_cards SET 
                             card_uid = '{dto.card_uid}', 
                             vehicle_id = {vehicleId}, 
                             is_guest = {(dto.is_guest == true ? 1 : 0)}, 
                             is_member = {(dto.is_member == true ? 1 : 0)}, 
                             employee_id = {employeeId}, 
                             pic_tenant_id = {tenantId} 
                             WHERE id = {id}";

                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new { status = true, message = "RFID Card berhasil diupdate!" });
                }

                return StatusCode(500, new { status = false, message = "Gagal mengupdate RFID Card!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Terjadi kesalahan: " + ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deactivate/{id}")]
        public async Task<ActionResult> DeactivateCard(int id)
        {
            try
            {
                var user = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var query = $@"UPDATE rfid_cards SET 
                             deactivated_by = '{user}', 
                             deactivated_at = NOW() 
                             WHERE id = {id}";

                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new { status = true, message = "Kartu berhasil dinonaktifkan!" });
                }

                return NotFound(new { status = false, message = "Kartu tidak ditemukan atau gagal update!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Terjadi kesalahan: " + ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteRfidCard(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM rfid_cards WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<RfidCard>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new { status = false, message = $"RFID Card dengan id {id} tidak ditemukan!" });
                }

                var query = $"DELETE FROM rfid_cards WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new { status = true, message = "RFID Card berhasil dihapus!" });
                }

                return StatusCode(500, new { status = false, message = "Gagal menghapus RFID Card!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = "Terjadi kesalahan: " + ex.Message });
            }
        }
    }
}