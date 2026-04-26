using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Parking.ExitParking;
using backend.Models;
using backend.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.DTOs.Parking.EntryParking;
using System.Security.Claims;

namespace backend.Controllers.Parking
{
    [ApiController]
    [Route("api/exit-parking")]
    public class ExitParkingController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public ExitParkingController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection is not configured.");
            _db = db;
        }

        [HttpPost]
        [Route("exit-rfid")]
        public async Task<IActionResult> ExitParkingRfid([FromBody] ExitParkingRfidDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.transaction_id))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Transaction id tidak boleh kosong!"
                    });
                }

                var gateExists = $"SELECT id, name FROM gates WHERE name = '{dto.gate}'";
                var gateExisting = await _db.ToSingleModel<Gate>(_config, gateExists);

                if (gateExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Gate tidak di temukan!"
                    });
                }

                var updateTransaction = $@"
                    UPDATE transactions SET exit_gate_id = {gateExisting.id}, exit_method = 'rfid', exit_at = NOW(), calculated_fee = {dto.calculated_fee}, status = 'paid' 
                    WHERE transaction_code = '{dto.transaction_id}'
                ";
                var updateTransactionRes = await _db.ExecuteQuery(_config, updateTransaction);

                var transactionExits = $"SELECT id, transaction_code, rfid_card_id FROM transactions WHERE transaction_code = '{dto.transaction_id}'";
                var transactionExisting = await _db.ToSingleModel<Transaction>(_config, transactionExits);

                if (transactionExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Transaksi tidak di temukan!"
                    });
                }

                var userClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userClaim))
                {
                    return Unauthorized(new
                    {
                        status = false,
                        message = "User tidak terautentikasi!"
                    });
                }

                var insertToPayment = $@"
                        INSERT INTO payments
                        (transaction_id, method, amount, status, cash_tendered, cash_change, paid_at, created_at, handled_by_user_id) 
                        VALUES
                        ({transactionExisting.id}, 'rfid', {dto.calculated_fee}, 'success', {dto.calculated_fee}, 0, NOW(), NOW(), {userClaim})
                ";
                var insertToPaymentRes = await _db.ExecuteQuery(_config, insertToPayment);

                var rfidCardExits = $"SELECT id ,card_uid, is_member, is_guest FROM rfid_cards WHERE id = {transactionExisting.rfid_card_id}";
                var rfidCardExisting = await _db.ToSingleModel<RfidCard>(_config, rfidCardExits);

                if (insertToPaymentRes > 0 && rfidCardExisting.is_guest == true)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Selamat Jalan, Semoga selamat sampai tujuan!"
                    });
                }
                else if (insertToPaymentRes > 0 && rfidCardExisting.is_member == true)
                {
                    Role? roleExisting = null;

                    if (rfidCardExisting.employee_id != null)
                    {
                        var employeeExists = $"SELECT id, name, role_id FROM employees WHERE id = {rfidCardExisting.employee_id}";
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
                        roleExisting = await _db.ToSingleModel<Role>(_config, roleExists);

                        if (roleExisting == null)
                        {
                            return NotFound(new
                            {
                                status = false,
                                message = "Role tidak diketahui!"
                            });
                        }
                    }

                    return Ok(new
                    {
                        status = true,
                        message = $"Selamat jalan {(roleExisting?.name ?? "Member")}, semoga selamat sampai tujuan!."
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
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = $"{ex.Message}"
                });
            }
        }

        [HttpPost]
        [Route("check-transaction")]
        public async Task<IActionResult> CheckTransaction([FromBody] CheckTransactionRequestDto dto)
        {
            try
            {
                var rfidExits = $@"
                    SELECT
                        id,
                        card_uid
                    FROM rfid_cards
                    WHERE card_uid = '{dto.rfid}'
                ";
                var rfidExisting = await _db.ToSingleModel<RfidCard>(_config, rfidExits);

                if (rfidExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Rfid Tidak ditemukan!"
                    });
                }

                var gateExists = $@"
                        SELECT 
                            zone_id, 
                            name, 
                            is_active
                        FROM gates
                        WHERE name = '{dto.gate}' AND is_active = TRUE";
                var gateExisting = await _db.ToSingleModel<Gate>(_config, gateExists);

                if (gateExisting == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Exit gate tidak ditemukan!"
                    });
                }

                var transactionExists = $@"
                    SELECT
                        t.transaction_code,
                        t.entry_gate_id,
                        t.entry_at,
                        t.status,
                        rf.card_uid,
                        rf.is_guest,
                        rf.is_member,
                        rf.employee_id,
                        rf.pic_tenant_id,
                        vt.name AS vehicle_type_name,
                        vt.minimum_fee,
                        g.zone_id,
                        g.name AS gate_name,
                        z.id AS zone_,
                        z.name AS zone_name,
                        z.additional_fee,
                        z.is_active,
                        fc.base_fee,
                        fc.grace_period_minutes,
                        fc.is_active
                    FROM transactions t
                    LEFT JOIN rfid_cards rf ON t.rfid_card_id = rf.id
                    LEFT JOIN vehicle_types vt ON t.vehicle_type_id = vt.id
                    LEFT JOIN gates g ON t.entry_gate_id = g.id
                    INNER JOIN zones z ON g.zone_id = z.id
                    INNER JOIN fee_configs fc ON fc.zone_id = z.id
                    WHERE t.rfid_card_id = {rfidExisting.id} 
                        AND z.is_active = TRUE
                        AND fc.is_active = TRUE
                        AND t.status = 'active'
                ";
                var transactionExisting = await _db.QueryRelation(_config, transactionExists);

                if (transactionExisting == null || !transactionExisting.Any())
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "mungkin kartu anda belum di tap-in"
                    });
                }

                var dataTransaction = transactionExisting.FirstOrDefault();

                if (dataTransaction == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "mungkin kartu anda belum di tap-in"
                    });
                }

                if (dataTransaction?.zone_ != gateExisting.zone_id)
                {
                    return StatusCode(422, new
                    {
                        status = false,
                        message = "Zona keluar tidak sesuai dengan zona yang anda masuki di awal⚠️"
                    });
                }

                Dictionary<string, dynamic> data = new Dictionary<string, dynamic>();

                var currentTime = DateTime.Now;

                try
                {
                    var calculatedFee = 0m;

                    if(dataTransaction?.is_guest == true)
                    {
                        TimeSpan duration = currentTime - dataTransaction?.entry_at;
                        decimal totalHours = (decimal)Math.Ceiling(duration.TotalHours);

                        var baseFee = dataTransaction?.minimum_fee;

                        if (dataTransaction?.additional_fee != 0)
                        {
                            baseFee += dataTransaction?.additional_fee;
                        }

                        if (dataTransaction?.base_fee != 0)
                        {
                            baseFee += dataTransaction?.base_fee;
                        }

                        calculatedFee = totalHours * baseFee;
                    }else if(dataTransaction?.is_member == true && dataTransaction?.employee_id != 0 || dataTransaction?.pic_tenant_id)
                    {
                        calculatedFee = 0;
                    }

                    

                    data.Add("transaction_code", dataTransaction?.transaction_code);
                    data.Add("calculated_fee", calculatedFee);
                    data.Add("vehicle_type", dataTransaction?.vehicle_type_name);

                    return Ok(new
                    {
                        status = true,
                        message = "Data berhasil di ambil!",
                        data = data
                    });
                }
                catch (OverflowException)
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Rentang waktu terlalu besar!"
                    });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = $"{ex.Message}"
                });
            }
        }

        // [HttpPost]
        // [Route("exit-ticket")]
        // private async Task<IActionResult> ExitParkingTicket()
        // {

        // }

        // private async Task<int> CalculateParkingFee()
        // {

        // }
    }
}