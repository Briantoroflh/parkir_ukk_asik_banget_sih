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
    [Route("api/gate-device-ads")]
    public class GateDeviceAdsController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;
        private readonly IWebHostEnvironment _environment;
        private readonly string _imageUploadPath = "images/gate-device-ads";

        public GateDeviceAdsController(IConfiguration configuration, DBHelper db, IWebHostEnvironment environment)
        {
            _config = configuration.GetConnectionString("DefaultConnection")!;
            _db = db;
            _environment = environment;
        }

        // ============ Helper Method: Save Base64 Image ============
        private async Task<string> SaveBase64ImageAsync(string base64String)
        {
            try
            {
                // Validate base64 string
                if (string.IsNullOrEmpty(base64String) || !base64String.Contains(","))
                {
                    throw new ArgumentException("Invalid base64 string format");
                }

                // Extract the base64 data and media type
                var parts = base64String.Split(",");
                var mimeType = parts[0].Split(":")[1].Split(";")[0];
                var base64Data = parts[1];

                // Validate MIME type
                var validMimeTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
                if (!validMimeTypes.Contains(mimeType))
                {
                    throw new ArgumentException("Invalid image format. Only JPEG, PNG, GIF, and WebP are allowed.");
                }

                // Get file extension
                var fileExtension = mimeType switch
                {
                    "image/jpeg" => ".jpg",
                    "image/png" => ".png",
                    "image/gif" => ".gif",
                    "image/webp" => ".webp",
                    _ => ".jpg"
                };

                // Create directory if not exists
                var uploadDir = Path.Combine(_environment.WebRootPath, _imageUploadPath);
                if (!Directory.Exists(uploadDir))
                {
                    Directory.CreateDirectory(uploadDir);
                }

                // Generate unique filename with timestamp
                var timestamp = DateTime.Now.Ticks;
                var filename = $"{timestamp}{fileExtension}";
                var filepath = Path.Combine(uploadDir, filename);

                // Decode and save the file
                var imageBytes = Convert.FromBase64String(base64Data);
                await System.IO.File.WriteAllBytesAsync(filepath, imageBytes);

                // Return relative path for database storage
                return $"{_imageUploadPath}/{filename}";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error saving image: {ex.Message}");
            }
        }

        // ============ Helper Method: Delete Image File ============
        private void DeleteImageFile(string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath))
                    return;

                var fullPath = Path.Combine(_environment.WebRootPath, imagePath);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting image: {ex.Message}");
                // Don't throw - just log the error
            }
        }

        // ============ GET ALL ADS ============
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<GateDeviceAds>>> GetAllAds()
        {
            try
            {
                var query = "SELECT * FROM gate_device_ads WHERE deleted_at IS NULL ORDER BY id DESC";
                var result = await _db.ToModel<GateDeviceAds>(_config, query);

                if (result != null && result.Any())
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
                        message = "Tidak ada data gate device ads yang ditemukan!"
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

        // ============ GET ADS BY ID ============
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetAdsById(int id)
        {
            try
            {
                var query = $"SELECT * FROM gate_device_ads WHERE id = {id} AND deleted_at IS NULL";
                var result = await _db.ToSingleModel<GateDeviceAds>(_config, query);

                if (result == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device ads dengan id {id} tidak ditemukan!"
                    });
                }

                return Ok(new
                {
                    status = true,
                    message = "Data ditemukan!",
                    data = result
                });
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

        // ============ GET ADS BY GATE DEVICE ID ============
        [HttpGet("by-device/{gate_device_id}")]
        public async Task<IActionResult> GetAdsByDeviceId(int gate_device_id)
        {
            try
            {
                var query = $"SELECT * FROM gate_device_ads WHERE gate_device_id = {gate_device_id} AND deleted_at IS NULL ORDER BY id DESC";
                var result = await _db.ToModel<GateDeviceAds>(_config, query);

                if (result == null || !result.Any())
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Tidak ada gate device ads untuk device id {gate_device_id}!"
                    });
                }

                return Ok(new
                {
                    status = true,
                    message = "Data ditemukan!",
                    data = result
                });
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

        // ============ CREATE ADS ============
        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<GateDeviceAds>> CreateAds([FromBody] GateDeviceAdsCreateDto dto)
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

                // Cek apakah gate device ada
                var gateDeviceExists = $"SELECT id FROM gate_devices WHERE id = {dto.gate_device_id}";
                var gateDeviceExisting = await _db.ToSingleModel<GateDevice>(_config, gateDeviceExists);

                if (gateDeviceExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Gate device tidak ditemukan!"
                    });
                }

                // Save base64 image and get relative path
                string imagePath;
                try
                {
                    imagePath = await SaveBase64ImageAsync(dto.image);
                }
                catch (Exception ex)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = ex.Message
                    });
                }

                // Escape single quotes in title and company for SQL
                var title = dto.title.Replace("'", "''");
                var company = dto.company.Replace("'", "''");

                var query = $@"
                    INSERT INTO gate_device_ads 
                    (gate_device_id, image, title, company, created_at, updated_at) 
                    VALUES 
                    ({dto.gate_device_id}, '{imagePath}', '{title}', '{company}', NOW(), NOW())
                ";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device ads berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan gate device ads!"
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

        // ============ UPDATE ADS ============
        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<ActionResult<GateDeviceAds>> UpdateAds(int id, [FromBody] GateDeviceAdsUpdateDto dto)
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

                // Cek apakah ads ada dan ambil data lama
                var checkQuery = $"SELECT * FROM gate_device_ads WHERE id = {id} AND deleted_at IS NULL";
                var checkResult = await _db.ToSingleModel<GateDeviceAds>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device ads dengan id {id} tidak ditemukan!"
                    });
                }

                // Cek apakah gate device ada
                var gateDeviceExists = $"SELECT id FROM gate_devices WHERE id = {dto.gate_device_id}";
                var gateDeviceExisting = await _db.ToSingleModel<GateDevice>(_config, gateDeviceExists);

                if (gateDeviceExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Gate device tidak ditemukan!"
                    });
                }

                // Handle image update - only if image data is provided
                string imagePath = checkResult.image; // Keep old image by default

                if (!string.IsNullOrEmpty(dto.image) && dto.image != checkResult.image)
                {
                    try
                    {
                        // Save new image
                        imagePath = await SaveBase64ImageAsync(dto.image);

                        // Delete old image file
                        DeleteImageFile(checkResult.image);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(new
                        {
                            status = false,
                            message = ex.Message
                        });
                    }
                }

                // Escape single quotes in title and company for SQL
                var title = dto.title.Replace("'", "''");
                var company = dto.company.Replace("'", "''");

                var query = $@"
                    UPDATE gate_device_ads 
                    SET 
                        gate_device_id = {dto.gate_device_id}, 
                        image = '{imagePath}', 
                        title = '{title}', 
                        company = '{company}', 
                        updated_at = NOW() 
                    WHERE id = {id}
                ";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device ads berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate gate device ads!"
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

        // ============ SOFT DELETE ADS ============
        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteAds(int id)
        {
            try
            {
                // Cek apakah ads ada
                var checkQuery = $"SELECT * FROM gate_device_ads WHERE id = {id} AND deleted_at IS NULL";
                var checkResult = await _db.ToSingleModel<GateDeviceAds>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device ads dengan id {id} tidak ditemukan!"
                    });
                }

                // Soft delete dengan update deleted_at
                var query = $"UPDATE gate_device_ads SET deleted_at = NOW(), updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    // Delete image file
                    DeleteImageFile(checkResult.image);

                    return Ok(new
                    {
                        status = true,
                        message = "Gate device ads berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus gate device ads!"
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