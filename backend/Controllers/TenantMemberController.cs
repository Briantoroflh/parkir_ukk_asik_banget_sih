using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.Payment;
using backend.DTOs.TenantMember;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/tenant-member")]
    public class TenantMemberController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public TenantMemberController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection is not configured.");
            _db = db;
        }

        [Authorize]
        [HttpGet]
        [Route("get-all-tenant")]
        public async Task<ActionResult<IEnumerable<TenantMember>>> GetAllTenant()
        {
            try
            {
                var tenant = $@" 
                    SELECT  
                        id,
                        user_id,
                        pic,
                        tenant_name,
                        status_membership,
                        total_bill,
                        total_current_payment,
                        is_active,
                        membership_id,
                        start_at,
                        due_at
                    FROM tenant_members
                    ORDER BY start_at DESC
            ";
                var tenantResult = await _db.ToModel<TenantMember>(_config, tenant);

                if (tenantResult != null)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data tenant ditemukan!",
                        data = tenantResult
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Data tenant belum tersedia!"
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        [Authorize]
        [HttpGet]
        [Route("get-tenant-by-user/{userId}")]
        public async Task<IActionResult> GetTenantByUserId(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "User ID tidak valid!"
                    });
                }

                var tenant = $@"
                    SELECT
                        id,
                        user_id,
                        pic,
                        tenant_name,
                        status_membership,
                        total_bill,
                        total_current_payment,
                        is_active,
                        membership_id,
                        start_at,
                        due_at,
                        created_at,
                        updated_at
                    FROM tenant_members
                    WHERE user_id = {userId}
                    ORDER BY start_at DESC
                ";

                var tenantResult = await _db.ToModel<TenantMember>(_config, tenant);

                if (tenantResult != null && tenantResult.Any())
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data tenant membership berdasarkan user ditemukan!",
                        data = tenantResult
                    });
                }

                return NotFound(new
                {
                    status = false,
                    message = "Data tenant membership untuk user ini tidak ditemukan!"
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        [Authorize]
        [HttpPost]
        [Route("create-tenant")]
        public async Task<IActionResult> CreateTenantMember([FromBody] TenantMemberCreateDto dto)
        {
            try
            {
                if (dto.user_id <= 0)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "User ID harus diisi!"
                    });
                }

                var membershipExists = $"SELECT id, package_name, price, time_period_month, is_active FROM membership_packages WHERE id = {dto.membership_id}";
                var membershipExisting = await _db.ToSingleModel<MembershipPackage>(_config, membershipExists);

                if (membershipExisting == null || !membershipExisting.is_active)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Paket membership tidak ditemukan atau sedang tidak aktif!"
                    });
                }

                var currentTime = DateTime.UtcNow;
                var dueAt = currentTime.AddMonths(membershipExisting.time_period_month);

                var tenant = $@"
                    INSERT INTO tenant_members 
                    (user_id, pic, tenant_name, status_membership, total_bill, total_current_payment, is_active, membership_id, start_at, due_at, created_at)
                    VALUES
                    ({dto.user_id}, '{dto.pic}', '{dto.tenant_name}', 'active', 0, {membershipExisting.price}, TRUE, {dto.membership_id}, '{currentTime:yyyy-MM-dd HH:mm:ss}', '{dueAt:yyyy-MM-dd HH:mm:ss}', '{currentTime:yyyy-MM-dd HH:mm:ss}')
                ";
                var tenantResult = await _db.ExecuteQuery(_config, tenant);

                if (tenantResult > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Tenant berhasil menjadi membership!",
                        data = tenantResult
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
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        [Authorize]
        [HttpPut]
        [Route("update-tenant/{id}")]
        public async Task<IActionResult> UpdateTenantMember(int id, [FromBody] TenantMemberUpdateDto dto)
        {
            try
            {
                if (dto.user_id <= 0)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "User ID harus diisi!"
                    });
                }

                var membershipExists = $"SELECT id, package_name, price, time_period_month, is_active FROM membership_packages WHERE id = {dto.membership_id}";
                var membershipExisting = await _db.ToSingleModel<MembershipPackage>(_config, membershipExists);

                if (membershipExisting == null || !membershipExisting.is_active)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Paket membership tidak ditemukan atau sedang tidak aktif!"
                    });
                }

                var currentTime = DateTime.UtcNow;
                var dueAt = currentTime.AddMonths(membershipExisting.time_period_month);

                var tenant = $@"
                    UPDATE tenant_members SET user_id = {dto.user_id}, pic = '{dto.pic}', tenant_name = '{dto.tenant_name}', membership_id = {dto.membership_id}, updated_at = '{currentTime:yyyy-MM-dd HH:mm:ss}' WHERE id = {id}
                ";
                var tenantResult = await _db.ExecuteQuery(_config, tenant);

                if (tenantResult > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data berhasil di update!",
                        data = tenantResult
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
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("delete-tenant/{id}")]
        public async Task<IActionResult> DeleteTenantMember(int id)
        {
            try
            {
                var tenantMember = $"SELECT id FROM tenant_members WHERE id = {id}";
                var tenantMemberResult = await _db.ToSingleModel<TenantMember>(_config, tenantMember);

                if (tenantMemberResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Tenant member tidak ditemukan!"
                    });
                }

                var tenant = $"DELETE FROM tenant_members WHERE id = {id}";
                var tenantResult = await _db.ExecuteQuery(_config, tenant);

                if (tenantResult > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data berhasil di hapus!"
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
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        [Authorize]
        [HttpGet]
        [Route("check-status-due")]
        public async Task<IActionResult> CheckStatusDue(int id)
        {
            try
            {
                var getDataTenant = $"SELECT id, pic, tenant_name, total_bill, total_current_payment, is_active, membership_id, start_at, due_at FROM tenant_members WHERE id = {id}";
                var getDataTenantResult = await _db.ToSingleModel<TenantMember>(_config, getDataTenant);

                if (getDataTenantResult == null || getDataTenantResult.due_at == null || getDataTenantResult.membership_id == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Data tenant tidak ditemukan atau belum lengkap!"
                    });
                }

                var currentTime = DateOnly.FromDateTime(DateTime.UtcNow).AddMonths(1);
                // var currentTime = DateOnly.FromDateTime(DateTime.UtcNow).AddMonths(1).AddDays(4);
                // var currentTime = DateOnly.FromDateTime(DateTime.UtcNow);
                var dueDate = DateOnly.FromDateTime(getDataTenantResult.due_at.Value);

                if (currentTime < dueDate && getDataTenantResult.status_membership != "suspended" && getDataTenantResult.is_active)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Membership masih aktif dan belum lewat tenggat / jatuh tempo"
                    });
                }
                else if (currentTime == dueDate)
                {
                    await UpdateStatusMember("due", id, getDataTenantResult.membership_id.Value);
                    return Ok(new
                    {
                        status = true,
                        message = "Membership masuk dalam masa tenggang 3 hari, silahkan bayar sebelum di suspend!"
                    });
                }
                else if (currentTime > dueDate.AddDays(3))
                {
                    await UpdateStatusMember("suspended", id, getDataTenantResult.membership_id.Value);
                    return Ok(new
                    {
                        status = true,
                        message = "Silahkan hubungi admin, untuk melakukan pengaktifan membership!"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Masa tenggang habis. Silahkan hubungi admin!"
                    });
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        [Authorize]
        [HttpPut]
        [Route("activate-membership/{id}")]
        public async Task<IActionResult> ActivateMembership(int id)
        {
            try
            {
                var tenantExists = $"SELECT id, pic, tenant_name, status_membership, total_bill, total_current_payment, is_active, membership_id FROM tenant_members WHERE id = {id}";
                var tenantExisting = await _db.ToSingleModel<TenantMember>(_config, tenantExists);

                if (tenantExisting == null)
                {
                    return NotFound(new { status = false, message = "Data tenant tidak ditemukan!" });
                }

                if (tenantExisting.is_active)
                {
                    return BadRequest(new { status = false, message = "Member sudah dalam status aktif!" });
                }

                var membershipExists = $"SELECT id, package_name, price, time_period_month FROM membership_packages WHERE id = {tenantExisting.membership_id}";
                var membershipExisting = await _db.ToSingleModel<MembershipPackage>(_config, membershipExists);

                if (membershipExisting == null)
                {
                    return NotFound(new { status = false, message = "Paket Membership tidak ditemukan!" });
                }

                var currentTime = DateTime.UtcNow;
                var dueAt = currentTime.AddMonths(membershipExisting.time_period_month);

                var updateStatus = $@"UPDATE tenant_members 
                             SET is_active = TRUE, 
                                 status_membership = 'active', 
                                 total_bill = 0, 
                                 total_current_payment = {membershipExisting.price}, 
                                 start_at = '{currentTime:yyyy-MM-dd HH:mm:ss}', 
                                 due_at = '{dueAt:yyyy-MM-dd HH:mm:ss}', 
                                 updated_at = '{currentTime:yyyy-MM-dd HH:mm:ss}' 
                             WHERE id = {id}";

                var updatedStatus = await _db.ExecuteQuery(_config, updateStatus);

                if (updatedStatus > 0)
                {
                    return Ok(new { status = true, message = "Aktifasi member berhasil!" });
                }

                return StatusCode(500, new { status = false, message = "Gagal memperbarui data ke database." });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        private async Task<int> UpdateStatusMember(string status_membership, int id, int membershipId)
        {
            var membershipExists = $"SELECT price FROM membership_packages WHERE id = {membershipId}";
            var membershipExisting = await _db.ToSingleModel<MembershipPackage>(_config, membershipExists);

            if (membershipExisting == null)
            {
                return 0;
            }

            var tenantExists = $"SELECT status_membership, total_bill, total_current_payment, is_active FROM tenant_members WHERE id = {id}";
            var tenantExisting = await _db.ToSingleModel<TenantMember>(_config, tenantExists);

            if (tenantExisting == null)
            {
                return 0;
            }

            var q = $"UPDATE tenant_members SET status_membership = '{status_membership}', total_bill = {membershipExisting.price}, total_current_payment = 0 WHERE id = {id}";
            var r = await _db.ExecuteQuery(_config, q);

            if (tenantExisting.status_membership == "suspended" || tenantExisting.status_membership == "due" && tenantExisting.is_active)
            {
                var isActiveTenantMember = $"UPDATE tenant_members SET is_active = FALSE WHERE id = {id}";
                var isActiveTenantMemberResult = await _db.ExecuteQuery(_config, isActiveTenantMember);
            }
            ;

            if (r > 0)
            {
                return r;
            }
            else
            {
                return 0;
            }
        }

        [Authorize]
        [HttpPost]
        [Route("membership-payment-midtrans")]
        public async Task<IActionResult> MembershipPaymentMidtrans([FromBody] PaymentMembershipRequestDto dto)
        {
            try
            {
                var options = new RestClientOptions("https://api.sandbox.midtrans.com/v2/charge");
                var client = new RestClient(options);
                var request = new RestRequest("");

                var transaction = new
                {
                    payment_type = "qris",
                    transaction_details = new
                    {
                        order_id = dto.order_id,
                        gross_amount = dto.gross_amount
                    },
                    customer_detail = new
                    {
                        first_name = "Briantoro",
                        last_name = "",
                        email = "briantoroflh@gmail.com",
                        phone = "081317477015"
                    },
                    qris = new
                    {
                        acquirer = "gopay"
                    }
                };

                var jsonRequest = JsonConvert.SerializeObject(transaction);

                request.AddHeader("accept", "application/json");
                request.AddHeader("authorization", "Basic U0ItTWlkLXNlcnZlci1pSWc5dHV5bkFBYW1fN1pKVmVIWkFibVA6");
                request.AddJsonBody(jsonRequest, false);
                var response = await client.PostAsync(request);

                return Ok(new
                {
                    status = true,
                    message = "Payment midtrans generated!",
                    data = response
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }

        [Authorize]
        [HttpPost]
        [Route("check-status-payment-midtrans")]
        public async Task<IActionResult> CheckStatusPaymentMidtrans([FromBody] CheckStatusRequest dto)
        {
            try
            {
               var options = new RestClientOptions("https://api.sandbox.midtrans.com/v2/" + dto.order_id +"/status");
                var client = new RestClient(options);
                var request = new RestRequest("");
                request.AddHeader("accept", "application/json");
                request.AddHeader("authorization", "Basic U0ItTWlkLXNlcnZlci1pSWc5dHV5bkFBYW1fN1pKVmVIWkFibVA6");
                var response = await client.GetAsync(request);

                return Ok(new
                {
                    status = true,
                    message = "Check status midtrans generated!",
                    data = response
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = $"Error: {e.Message}"
                });
            }
        }
    }
}