using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Parking.EntryParking;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using IronBarCode;

namespace backend.Controllers.Parking
{
    [ApiController]
    [Route("api/entry-parking")]
    public class EntryParkingController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public EntryParkingController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [HttpPost]
        [Route("entry-rfid")]
        public async Task<IActionResult> EntryParkingRfid([FromBody] EntryParkingRfidDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.rfid))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Rfid tidak di tap-in!"
                    });
                }

                if (string.IsNullOrEmpty(dto.plate))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Plate number harus di capture!"
                    });
                }

                var rfidData = $"SELECT id, card_uid, is_guest, is_member, employee_id FROM rfid_cards WHERE card_uid = '{dto.rfid}'";
                var rfidDataResult = await _db.ToSingleModel<RfidCard>(_config, rfidData);

                if (rfidDataResult != null)
                {
                    var gateExists = $"SELECT id, name, zone_id FROM gates WHERE name = '{dto.gate}'";
                    var gateExisting = await _db.ToSingleModel<Gate>(_config, gateExists);

                    if (gateExisting == null)
                    {
                        return NotFound(new
                        {
                            status = false,
                            message = "Gate tidak ditemukan!"
                        });
                    }

                    var zoneExists = $"SELECT id, name FROM zones WHERE id = '{gateExisting.zone_id}'";
                    var zoneExisting = await _db.ToSingleModel<Zone>(_config, zoneExists);

                    if (zoneExisting == null)
                    {
                        return NotFound(new
                        {
                            status = false,
                            message = "Zone tidak ditemukan!"
                        });
                    }

                    var gateData = $"""
                        SELECT gates.zone_id, fee_configs.id as fee_config_id,fee_configs.zone_id, fee_configs.vehicle_type_id, zones.name, fee_configs.base_fee
                        FROM gates 
                        RIGHT JOIN zones ON gates.zone_id = zones.id
                        RIGHT JOIN fee_configs ON fee_configs.zone_id = zones.id
                        WHERE zones.id = {zoneExisting.id} AND gates.id = {gateExisting.id}
                    """;
                    var gateDataResult = await _db.QueryRelation(_config, gateData);
                    var gate = gateDataResult.FirstOrDefault();

                    Dictionary<string, object> param = new Dictionary<string, object>();
                    param.Add("entry_method", "rfid");
                    param.Add("entry_gate_id", gateExisting.id);
                    param.Add("receipt_printed", false);
                    param.Add("vehicle_type_id", gate?.vehicle_type_id);
                    param.Add("zone_id", gate?.zone_id);
                    param.Add("rfid_card_id", rfidDataResult.id);
                    param.Add("fee_config_id", gate?.fee_config_id);


                    if (rfidDataResult.is_member == true && rfidDataResult.vehicle_id != null)
                    {
                        param.Add("vehicle_id", rfidDataResult.vehicle_id);
                    }

                    var enteranceTracking = await EnteranceTracking(param);

                    if (enteranceTracking > 0 && rfidDataResult.is_guest == true)
                    {
                        var plateExists = $"SELECT id ,plate_number FROM vehicles WHERE plate_number = '{dto.plate}'";
                        var plateExisting = await _db.ToSingleModel<Vehicle>(_config, plateExists);

                        if (plateExisting == null)
                        {
                            var vehicleType = $"SELECT id ,name FROM vehicle_types WHERE name = '{dto.vehicle_type}'";
                            var vechileTypeExists = await _db.ToSingleModel<VehicleTypes>(_config, vehicleType);

                            var vehicleInsert = $"INSERT INTO vehicles (plate_number, vehicle_type_id, source, notes, created_at) VALUES ('{dto.plate}', {vechileTypeExists.id}, 'OCR', 'Auto Ocr', NOW())";
                            var vehicleResult = await _db.ExecuteQuery(_config, vehicleInsert);
                        }

                        return Ok(new
                        {
                            status = true,
                            message = "Silahkan masuk!"
                        });
                    }
                    else if (enteranceTracking > 0 && rfidDataResult.is_member == true && rfidDataResult.employee_id != null && rfidDataResult.is_guest == false)
                    {
                        var plateExists = $"SELECT id ,plate_number FROM vehicles WHERE plate_number = '{dto.plate}'";
                        var plateExisting = await _db.ToSingleModel<Vehicle>(_config, plateExists);

                        if (plateExisting == null)
                        {
                            var vehicleType = $"SELECT id ,name FROM vehicle_types WHERE name = '{dto.vehicle_type}'";
                            var vechileTypeExists = await _db.ToSingleModel<VehicleTypes>(_config, vehicleType);

                            var vehicleInsert = $"INSERT INTO vehicles (plate_number, vehicle_type_id, source, notes, created_at) VALUES ('{dto.plate}', {vechileTypeExists.id}, 'OCR', 'Auto Ocr', NOW())";
                            var vehicleResult = await _db.ExecuteQuery(_config, vehicleInsert);
                        }

                        if (rfidDataResult.vehicle_id != null)
                        {
                            var vehicleExists = $"SELECT id, plate_number FROM vehicles WHERE id = {rfidDataResult.vehicle_id}";
                            var vehicleExisting = await _db.ToSingleModel<Vehicle>(_config, vehicleExists);


                        }

                        var employeeExists = $"SELECT id, name, role_id FROM employees WHERE id = {rfidDataResult.employee_id}";
                        var employeeExisting = await _db.ToSingleModel<Employee>(_config, employeeExists);

                        if (employeeExisting == null)
                        {
                            return NotFound(new
                            {
                                status = false,
                                message = "Employee tidak terdaftar!"
                            });
                        }

                        var roleExists = $"SELECT id, name FROM roles WHERE id = {employeeExisting.role_id}";
                        var roleExisting = await _db.ToSingleModel<Role>(_config, roleExists);

                        if (roleExisting == null)
                        {
                            return NotFound(new
                            {
                                status = false,
                                message = "Role tidak diketahui!"
                            });
                        }

                        return Ok(new
                        {
                            status = true,
                            message = $"Selamat datang kembali {roleExisting.name}, semoga sukses untuk pekerjaan hari ini😁🎉."
                        });
                    }
                    else
                    {
                        return StatusCode(500, new
                        {
                            status = false,
                            message = "Terjadi kesalahan!"
                        });
                    }
                }
                else
                {
                    // jika rfid tidak ada di rfid_cards
                    var gateExists = $"SELECT id, name, zone_id FROM gates WHERE name = '{dto.gate}'";
                    var gateExisting = await _db.ToSingleModel<Gate>(_config, gateExists);

                    if (gateExisting == null)
                    {
                        return NotFound(new
                        {
                            status = false,
                            message = "Gate tidak ditemukan!"
                        });
                    }

                    var zoneExists = $"SELECT id, name FROM zones WHERE id = '{gateExisting.zone_id}'";
                    var zoneExisting = await _db.ToSingleModel<Zone>(_config, zoneExists);

                    if (zoneExisting == null)
                    {
                        return NotFound(new
                        {
                            status = false,
                            message = "Zone tidak ditemukan!"
                        });
                    }

                    var gateData = $"""
                        SELECT gates.zone_id, fee_configs.id as fee_config_id,fee_configs.zone_id, fee_configs.vehicle_type_id, zones.name, fee_configs.base_fee
                        FROM gates 
                        RIGHT JOIN zones ON gates.zone_id = zones.id
                        RIGHT JOIN fee_configs ON fee_configs.zone_id = zones.id
                        WHERE zones.id = {zoneExisting.id} AND gates.id = {gateExisting.id}
                    """;
                    var gateDataResult = await _db.QueryRelation(_config, gateData);
                    var gate = gateDataResult.FirstOrDefault();

                    var entryRfidCard = $"INSERT INTO rfid_cards (card_uid, is_guest, created_at) VALUES ('{dto.rfid}', true, NOW())";
                    var entryRfid = await _db.ExecuteQuery(_config, entryRfidCard);

                    var newRfidData = $"SELECT id, card_uid, is_guest, is_member, employee_id, vehicle_id FROM rfid_cards WHERE card_uid = '{dto.rfid}' ORDER BY id DESC LIMIT 1";
                    var newRfidDataResult = await _db.ToSingleModel<RfidCard>(_config, newRfidData);

                    if (newRfidDataResult == null)
                    {
                        return StatusCode(500, new
                        {
                            status = false,
                            message = "Gagal membuat RFID card baru!"
                        });
                    }

                    Dictionary<string, object> param = new Dictionary<string, object>();
                    param.Add("entry_method", "rfid");
                    param.Add("entry_gate_id", gateExisting.id);
                    param.Add("receipt_printed", false);
                    param.Add("vehicle_type_id", gate?.vehicle_type_id);
                    param.Add("zone_id", gate?.zone_id);
                    param.Add("rfid_card_id", newRfidDataResult.id);
                    param.Add("fee_config_id", gate?.fee_config_id);


                    if (newRfidDataResult.is_member == true && newRfidDataResult.vehicle_id != null)
                    {
                        param.Add("vehicle_id", newRfidDataResult.vehicle_id);
                    }

                    var enteranceTracking = await EnteranceTracking(param);

                    if (enteranceTracking > 0 && newRfidDataResult.is_guest == true)
                    {
                        var plateExists = $"SELECT id ,plate_number FROM vehicles WHERE plate_number = '{dto.plate}'";
                        var plateExisting = await _db.ToSingleModel<Vehicle>(_config, plateExists);

                        if (plateExisting == null)
                        {
                            var vehicleType = $"SELECT id ,name FROM vehicle_types WHERE name = '{dto.vehicle_type}'";
                            var vechileTypeExists = await _db.ToSingleModel<VehicleTypes>(_config, vehicleType);

                            var vehicleInsert = $"INSERT INTO vehicles (plate_number, vehicle_type_id, source, notes, created_at) VALUES ('{dto.plate}', {vechileTypeExists.id}, 'OCR', 'Auto Ocr', NOW())";
                            var vehicleResult = await _db.ExecuteQuery(_config, vehicleInsert);
                        }

                        return Ok(new
                        {
                            status = true,
                            message = "Silahkan masuk!"
                        });
                    }
                    else if (enteranceTracking > 0 && newRfidDataResult.is_member == true && newRfidDataResult.employee_id != null && newRfidDataResult.is_guest == false)
                    {
                        var plateExists = $"SELECT id ,plate_number FROM vehicles WHERE plate_number = '{dto.plate}'";
                        var plateExisting = await _db.ToSingleModel<Vehicle>(_config, plateExists);

                        if (plateExisting == null)
                        {
                            var vehicleType = $"SELECT id ,name FROM vehicle_types WHERE name = '{dto.vehicle_type}'";
                            var vechileTypeExists = await _db.ToSingleModel<VehicleTypes>(_config, vehicleType);

                            var vehicleInsert = $"INSERT INTO vehicles (plate_number, vehicle_type_id, source, notes, created_at) VALUES ('{dto.plate}', {vechileTypeExists.id}, 'OCR', 'Auto Ocr', NOW())";
                            var vehicleResult = await _db.ExecuteQuery(_config, vehicleInsert);
                        }

                        if (newRfidDataResult.vehicle_id != null)
                        {
                            var vehicleExists = $"SELECT id, plate_number FROM vehicles WHERE id = {newRfidDataResult.vehicle_id}";
                            var vehicleExisting = await _db.ToSingleModel<Vehicle>(_config, vehicleExists);


                        }

                        var employeeExists = $"SELECT id, name, role_id FROM employees WHERE id = {newRfidDataResult.employee_id}";
                        var employeeExisting = await _db.ToSingleModel<Employee>(_config, employeeExists);

                        if (employeeExisting == null)
                        {
                            return NotFound(new
                            {
                                status = false,
                                message = "Employee tidak terdaftar!"
                            });
                        }

                        var roleExists = $"SELECT id, name FROM roles WHERE id = {employeeExisting.role_id}";
                        var roleExisting = await _db.ToSingleModel<Role>(_config, roleExists);

                        if (roleExisting == null)
                        {
                            return NotFound(new
                            {
                                status = false,
                                message = "Role tidak diketahui!"
                            });
                        }

                        return Ok(new
                        {
                            status = true,
                            message = $"Selamat datang kembali {roleExisting.name}, semoga sukses untuk pekerjaan hari ini😁🎉."
                        });
                    }
                    else
                    {
                        return StatusCode(500, new
                        {
                            status = false,
                            message = "Terjadi kesalahan!"
                        });
                    }
                }


            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR EntryParkingRfid: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {ex.Message}",
                    error_detail = ex.StackTrace
                });
            }
        }

        // [HttpPost]
        // [Route("entry-ticket")]
        // public async Task<IActionResult> EntryParkingTicket([FromBody] EntryParkingTicketDto dto)
        // {
        //     try
        //     {
        //         if (string.IsNullOrEmpty(dto.plate_number))
        //         {
        //             return BadRequest(new
        //             {
        //                 status = false,
        //                 message = "Nomor plat kendaraan tidak boleh kosong!"
        //             });
        //         }

        //         if (string.IsNullOrEmpty(dto.gate))
        //         {
        //             return BadRequest(new
        //             {
        //                 status = false,
        //                 message = "Gate tidak boleh kosong!"
        //             });
        //         }

        //         var gateExists = $"SELECT id, name, zone_id FROM gates WHERE name = '{dto.gate}'";
        //         var gateExisting = await _db.ToSingleModel<Gate>(_config, gateExists);

        //         if (gateExisting == null)
        //         {
        //             return NotFound(new
        //             {
        //                 status = false,
        //                 message = "Gate tidak ditemukan!"
        //             });
        //         }

        //         var zoneExists = $"SELECT id, name FROM zones WHERE id = '{gateExisting.zone_id}'";
        //         var zoneExisting = await _db.ToSingleModel<Zone>(_config, zoneExists);

        //         if (zoneExisting == null)
        //         {
        //             return NotFound(new
        //             {
        //                 status = false,
        //                 message = "Zone tidak ditemukan!"
        //             });
        //         }

        //         var gateData = $"""
        //             SELECT 
        //                 gates.zone_id, 
        //                 fee_configs.zone_id, 
        //                 fee_configs.vehicle_type_id, 
        //                 zones.name, 
        //                 zones.capacity, 
        //                 fee_configs.base_fee,
        //                 vehicle_types.name as vehicle_name
        //             FROM gates 
        //             RIGHT JOIN zones ON gates.zone_id = zones.id
        //             RIGHT JOIN fee_configs ON fee_configs.zone_id = zones.id
        //             RIGHT JOIN vehicle_types ON fee_configs.vehicle_type_id = vehicle_types.id
        //             WHERE zones.id = {zoneExisting.id} AND gates.id = {gateExisting.id}
        //         """;
        //         var gateDataResult = await _db.QueryRelation(_config, gateData);

        //         var gate = gateDataResult.FirstOrDefault();

        //         // ============ STEP 6: GENERATE UNIQUE ID & BARCODE ============
        //         Random rand = new Random();
        //         var uniqueId = "TKT" + DateTime.Now.ToString("yyyyMMddHHmmss") + rand.Next(1000, 9999);
        //         var entryTime = DateTime.Now;

        //         var barcodeFilePath = await GenerateBarcode(uniqueId, entryTime, dto.plate_number);

        //         if (string.IsNullOrEmpty(barcodeFilePath))
        //         {
        //             return StatusCode(500, new
        //             {
        //                 status = false,
        //                 message = "Gagal generate barcode!"
        //             });
        //         }

        //         // ============ STEP 7: INSERT TICKET PARKIR ============
        //         string sqlInsertTicket = $@"
        //             INSERT INTO ticket_parkings (uniq_id, barcode, vehicle_id, created_at) 
        //             VALUES ('{uniqueId}', '{barcodeFilePath}', {gate?.vehicle_type_id}, '{entryTime:yyyy-MM-dd HH:mm:ss}')
        //         ";

        //         var ticketResult = await _db.ExecuteQuery(_config, sqlInsertTicket);

        //         if (ticketResult <= 0)
        //         {
        //             return StatusCode(500, new
        //             {
        //                 status = false,
        //                 message = "Terjadi kesalahan saat menyimpan tiket parkir!"
        //             });
        //         }

        //         // ============ STEP 8: GET TICKET ID ============
        //         string sqlGetTicket = $@"
        //             SELECT id FROM ticket_parkings 
        //             WHERE uniq_id = '{uniqueId}' 
        //             ORDER BY id DESC 
        //             LIMIT 1
        //         ";

        //         var getTicketResult = await _db.ToSingleModel<dynamic>(_config, sqlGetTicket);
        //         int ticketId = Convert.ToInt32(getTicketResult?.id ?? 0);

        //         if (ticketId == 0)
        //         {
        //             return StatusCode(500, new
        //             {
        //                 status = false,
        //                 message = "Gagal mengambil ID tiket parkir!"
        //             });
        //         }

        //         // ============ STEP 9: INSERT ENTERANCE TRACKING ============
        //         var enteranceResult = await EnteranceTracking(null, ticketId, gateExisting.id);

        //         if (enteranceResult <= 0)
        //         {
        //             return StatusCode(500, new
        //             {
        //                 status = false,
        //                 message = "Gagal mencatat data enterance tracking!"
        //             });
        //         }

        //         // ============ STEP 10: PREPARE RESPONSE ============
        //         var response = new
        //         {
        //             status = true,
        //             message = "Tiket parkir berhasil digenerate!",
        //             data = new
        //             {
        //                 ticket_id = ticketId,
        //                 ticket_code = uniqueId,
        //                 barcode_path = barcodeFilePath,
        //                 vehicle_plate = dto.plate_number,
        //                 vehicle_type = gate?.vehicle_name,
        //                 zone = zoneExisting.name,
        //                 gate = gateExisting.name,
        //                 check_in_time = entryTime,
        //                 base_fee = gate?.base_fee,
        //                 fee_currency = "IDR"
        //             }
        //         };

        //         return Ok(response);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new
        //         {
        //             status = false,
        //             message = "Terjadi kesalahan saat memproses entry parkir!",
        //             error = ex.Message
        //         });
        //     }
        // }

        private async Task<int> EnteranceTracking(Dictionary<string, object> param)
        {
            param["entry_method"] = param.GetValueOrDefault("entry_method") ?? "";
            param["entry_qr_code"] = param.GetValueOrDefault("entry_qr_code") ?? "";
            param["entry_photo_url"] = param.GetValueOrDefault("entry_photo_url") ?? "";
            param["entry_gate_id"] = param.GetValueOrDefault("entry_gate_id") ?? throw new Exception("Entry gate must have default value!");
            param["status"] = param.GetValueOrDefault("status") ?? "active";
            param["vehicle_type_id"] = param.GetValueOrDefault("vehicle_type_id") ?? throw new Exception("vehicle_type_id must have default value!");
            // param["holiday_rate_id"] = param.GetValueOrDefault("holiday_rate_id");
            param["zone_id"] = param.GetValueOrDefault("zone_id") ?? throw new Exception("Zone must have default value!");
            param["rfid_card_id"] = param.GetValueOrDefault("rfid_card_id") ?? throw new Exception("Rfid card must have default value!");
            param["fee_config_id"] = param.GetValueOrDefault("fee_config_id") ?? throw new Exception("Fee config must have default value!");

            if (param.ContainsKey("receipt_printed") && (bool)param["receipt_printed"] != false)
            {
                param["receipt_printed_at"] = param.GetValueOrDefault("receipt_printed_at") ?? DateTime.Now;
            }

            try
            {
                var generateCode = "TRX" + DateTime.Now + Random.Shared.Next(0000, 9999);
                var inAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                var createdAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                var query = $@"
                    INSERT INTO transactions (transaction_code, entry_method, entry_qr_code, entry_at, entry_photo_url, entry_gate_id, status, receipt_printed, vehicle_type_id, zone_id, rfid_card_id, fee_config_id, created_at) 
                    VALUES ('{generateCode}', '{param["entry_method"]}', '{param["entry_qr_code"]}', NOW(), '{param["entry_photo_url"]}', '{param["entry_gate_id"]}', '{param["status"]}', '{((bool)param["receipt_printed"] ? 1 : 0)}', {param["vehicle_type_id"]}, {param["zone_id"]}, {param["rfid_card_id"]}, {param["fee_config_id"]}, NOW())
                ";

                var result = await _db.ExecuteQuery(_config, query);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting enterance tracking: {ex.Message}");
                return 0;
            }
        }

        private async Task<string> GenerateBarcode(string uniqueId, DateTime entryTime, string plateNumber)
        {
            try
            {
                // Setup barcode directory
                var barcodeDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "barcodes");

                // Create directory if not exists
                if (!Directory.Exists(barcodeDirectory))
                {
                    Directory.CreateDirectory(barcodeDirectory);
                }

                // Generate filename
                var fileName = $"{uniqueId}_{DateTime.Now:yyyyMMddHHmmss}.png";
                var filePath = Path.Combine(barcodeDirectory, fileName);

                // Generate barcode with IronBarCode
                var barcode = QRCodeWriter.CreateQrCode(
                    uniqueId,
                    500,
                    QRCodeWriter.QrErrorCorrectionLevel.Medium
                );

                // Set barcode properties
                barcode.ResizeTo(600, 200);

                // Add text annotations below barcode
                barcode.AddAnnotationTextAboveBarcode($"Waktu Masuk: {entryTime:dd/MM/yyyy HH:mm:ss}");
                barcode.AddAnnotationTextBelowBarcode("Simpan Tiket Ini Untuk Keluar");

                // Save barcode to file
                barcode.SaveAsPng(filePath);

                // Return relative path
                return $"/barcodes/{fileName}";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating barcode: {ex.Message}");
                return null;
            }
        }
    }
}