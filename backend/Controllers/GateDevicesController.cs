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
    [Route("api/gate-device")]
    public class GateDevicesController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public GateDevicesController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<GateDevice>>> GetAllGateDevices()
        {
            try
            {
                var query = @"
                    SELECT 
                        gate_devices.id, 
                        gate_devices.gate_id,
                        gate_devices.uniqUrl,
                        gate_devices.device_type,
                        gate_devices.status,
                        gate_devices.created_at,
                        gate_devices.updated_at,
                        gate_device_ads.id as ads_id,
                        gate_device_ads.image,
                        gate_device_ads.title,
                        gate_device_ads.company,
                        gate_device_ads.created_at as ads_created_at,
                        gate_device_ads.updated_at as ads_updated_at,
                        gate_device_ads.deleted_at
                    FROM gate_devices
                    LEFT JOIN gate_device_ads ON gate_devices.id = gate_device_ads.gate_device_id
                    ORDER BY gate_devices.id DESC
                ";
                var result = await _db.QueryRelation(_config, query);

                if (result != null && result.Any())
                {
                    // Group by device using dot notation for dynamic properties
                    var groupedDevices = result
                        .GroupBy(r => r.id)
                        .Select(g => new
                        {
                            device = new
                            {
                                id = g.Key,
                                gate_id = g.First().gate_id,
                                uniqUrl = g.First().uniqUrl,
                                device_type = g.First().device_type,
                                status = g.First().status,
                                created_at = g.First().created_at,
                                updated_at = g.First().updated_at
                            },
                            ads = g.Where(x => x.ads_id != null)
                                .Select(x => new
                                {
                                    id = x.ads_id,
                                    gate_device_id = g.Key,
                                    image = x.image,
                                    title = x.title,
                                    company = x.company,
                                    created_at = x.ads_created_at,
                                    updated_at = x.ads_updated_at,
                                    deleted_at = x.deleted_at
                                }).ToList()
                        })
                        .ToList();

                    return Ok(new
                    {
                        status = true,
                        message = "Data ditemukan!",
                        data = groupedDevices
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Tidak ada data gate device yang ditemukan!"
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
        [HttpGet("device/{uniqUrl}")]
        public async Task<IActionResult> GetAllGateDevice(string uniqUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(uniqUrl))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "uniqUrl tidak boleh kosong!"
                    });
                }

                // Get Gate Device by uniqUrl with JOIN gate_device_ads
                var deviceQuery = $@"
                    SELECT 
                        gate_devices.id, 
                        gate_devices.gate_id,
                        gate_devices.uniqUrl,
                        gate_devices.device_type,
                        gate_devices.status,
                        gate_devices.created_at,
                        gate_devices.updated_at,
                        gates.name as gate_name,
                        gate_device_ads.id as ads_id,
                        gate_device_ads.image,
                        gate_device_ads.title,
                        gate_device_ads.company,
                        gate_device_ads.created_at as ads_created_at,
                        gate_device_ads.updated_at as ads_updated_at,
                        gate_device_ads.deleted_at
                    FROM gate_devices
                    INNER JOIN gates ON gate_devices.gate_id = gates.id
                    LEFT JOIN gate_device_ads ON gate_devices.id = gate_device_ads.gate_device_id
                    WHERE gate_devices.uniqUrl = '{uniqUrl}'
                    ORDER BY gate_device_ads.id DESC
                ";
                var deviceResult = await _db.QueryRelation(_config, deviceQuery);

                if (deviceResult == null || !deviceResult.Any())
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device dengan uniqUrl '{uniqUrl}' tidak ditemukan!"
                    });
                }

                // Extract device data (same for all rows) using dot notation for dynamic properties
                var firstRow = deviceResult.FirstOrDefault();
                var device = new
                {
                    id = firstRow?.id,
                    gate_id = firstRow?.gate_id,
                    uniqUrl = firstRow?.uniqUrl,
                    device_type = firstRow?.device_type,
                    status = firstRow?.status,
                    gate_name = firstRow?.gate_name,
                    created_at = firstRow?.created_at,
                    updated_at = firstRow?.updated_at
                };

                // Extract ads data (filter null ads_id) using dot notation for dynamic properties
                var ads = deviceResult
                    .Where(x => x.ads_id != null)
                    .Select(x => new
                    {
                        id = x.ads_id,
                        gate_device_id = x.id,
                        image = x.image,
                        title = x.title,
                        company = x.company,
                        created_at = x.ads_created_at,
                        updated_at = x.ads_updated_at,
                        deleted_at = x.deleted_at
                    })
                    .ToList();

                return Ok(new
                {
                    status = true,
                    message = "Data ditemukan!",
                    data = new
                    {
                        device = device,
                        ads = ads
                    }
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

        [Authorize]
        [HttpPost("create-gate-device")]
        public async Task<ActionResult<GateDevice>> CreateGateDevice([FromBody] GateDeviceCreateDto dto)
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

                var gateExists = $"SELECT id, name, gate_type FROM gates WHERE id = {dto.gate_id}";
                var gateExisting = await _db.ToSingleModel<Gate>(_config, gateExists);

                if (gateExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Gate tidak ditemukan!"
                    });
                }

                var ifEntrance = gateExisting.gate_type == "entrance" ? "entry" : "exit";
                var cleanName = gateExisting.name.ToLower().Replace(" ", "").Replace("entrance", "").Replace("exit", "");
                var generateUniqUrl = "parking-" + cleanName + ifEntrance + "-aonik";

                // Check if uniq_url already exists
                var checkQuery = $"SELECT id FROM gate_devices WHERE uniqUrl = '{generateUniqUrl}'";
                var checkResult = await _db.ToSingleModel<GateDevice>(_config, checkQuery);

                if (checkResult != null)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = $"Gate Device dengan uni url {generateUniqUrl} sudah terdaftar!"
                    });
                }

                var query = $"INSERT INTO gate_devices (gate_id, uniqUrl, device_type, status, created_at, updated_at) VALUES ({dto.gate_id}, '{generateUniqUrl}', '{dto.device_type ?? ""}', TRUE, NOW(), NOW())";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device berhasil ditambahkan!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menambahkan gate device!"
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
        [HttpPut("update-gate-device/{id}")]
        public async Task<ActionResult<GateDevice>> UpdateGateDevice(int id, [FromBody] GateDeviceUpdateDto dto)
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

                var checkQuery = $"SELECT id FROM gate_devices WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<GateDevice>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"UPDATE gate_devices SET gate_id = {dto.gate_id}, device_type = '{dto.device_type ?? ""}', status = {(dto.status ? 1 : 0)}, updated_at = NOW() WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device berhasil diupdate!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal mengupdate gate device!"
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
        [HttpDelete("delete-gate-device/{id}")]
        public async Task<ActionResult> DeleteGateDevice(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM gate_devices WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<GateDevice>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Gate device dengan id {id} tidak ditemukan!"
                    });
                }

                var query = $"DELETE FROM gate_devices WHERE id = {id}";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Gate device berhasil dihapus!",
                        data = result
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Gagal menghapus gate device!"
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