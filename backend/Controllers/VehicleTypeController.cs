using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.VehicleType;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/vehicle-type")]
    public class VehicleTypeController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public VehicleTypeController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<VehicleTypes>>> GetAllVehicleType()
        {
            try
            {
                var query = "SELECT * FROM vehicle_types ORDER BY id DESC";
                var result = await _db.ToModel<VehicleTypes>(_config, query);

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
                        message = "Tidak ada data vehicle type yang ditemukan!"
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
        [HttpPost("create-vehicle-type")]
        public async Task<ActionResult<VehicleTypes>> CreateVehicleType([FromBody] VehicleTypeCreateDto dto)
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

                var query = $"INSERT INTO vehicle_types (name, minimum_fee, description, created_at) VALUES ('{dto.name}', {dto.minimum_fee}, '{dto.description ?? ""}', NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Vehicle type berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan vehicle type!"
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
        [HttpPut("update-vehicle-type/{id}")]
        public async Task<ActionResult<VehicleTypes>> UpdateVehicleType(int id, [FromBody] VehicleTypeUpdateDto dto)
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

                var checkQuery = $"SELECT id FROM vehicle_types WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<VehicleTypes>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Vehicle type dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE vehicle_types SET name = '{dto.name}', minimum_fee = {dto.minimum_fee}, description = '{dto.description ?? ""}' WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Vehicle type berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate vehicle type!"
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
        [HttpDelete("delete-vehicle-type/{id}")]
        public async Task<ActionResult> DeleteVehicleType(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM vehicle_types WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<VehicleTypes>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Vehicle type dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM vehicle_types WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Vehicle type berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus vehicle type!"
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