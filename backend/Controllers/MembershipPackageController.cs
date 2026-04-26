using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.MembershipPackage;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/membership-package")]
    public class MembershipPackageController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public MembershipPackageController(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        [Authorize]
        [HttpGet]
        [Route("get-all-membership")]
        public async Task<ActionResult<IEnumerable<MembershipPackage>>> GetAllMembership()
        {
            try
            {
                var membership = $@"
                    SELECT
                        id,
                        package_name,
                        price,
                        time_period_month,
                        is_active
                    FROM membership_packages
                ";
                var membershipResult = await _db.ToModel<MembershipPackage>(_config, membership);

                if(membershipResult != null)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data berhasil diambil!",
                        data = membershipResult
                    });
                }else
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Data belum tersedia!"
                    });
                }
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = e.Message
                });
            }
        }

        [Authorize]
        [HttpPost]
        [Route("create-membership")]
        public async Task<IActionResult> CreateMembership([FromBody] MembershipPackageCreateDto dto)
        {
            try
            {
                var currentTime = DateTime.UtcNow;

                var membership = $@"
                    INSERT INTO membership_packages 
                    (package_name, price, time_period_month, is_active, created_at) 
                    VALUES
                    ('{dto.package_name}', {dto.price}, {dto.time_period_month}, TRUE, '{currentTime:yyyy-MM-dd HH:mm:ss}')
                ";
                var membershipResult = await _db.ExecuteQuery(_config, membership);

                if(membershipResult > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Membership berhasil dibuat!",
                        data = membershipResult
                    });
                }else
                {
                    return StatusCode(500, new
                    {
                        status = false,
                        message = "Terjadi Kesalahan!"
                    });
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new
                {
                   status = false,
                   message = ex.Message 
                });
            }
        }

        [Authorize]
        [HttpPut]
        [Route("update-membership/{id}")]
        public async Task<IActionResult> UpdateMembership(int id,[FromBody] MembershipPackageUpdateDto dto)
        {
            try
            {
                var membership = $@"
                    UPDATE membership_packages SET package_name = '{dto.package_name}', price = {dto.price}, time_period_month = {dto.time_period_month}, is_active = {dto.is_active} WHERE id = {id}
                ";
                var membershipResult = await _db.ExecuteQuery(_config, membership);

                if(membershipResult > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data berhasil diupdate!",
                        data = membershipResult
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
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = e.Message
                });
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult>  DeleteMembership(int id)
        {
            try
            {
                var checkQuery = $"SELECT id FROM membership_packages WHERE id = {id}";
                var checkResult = await _db.ToSingleModel<MembershipPackage>(_config, checkQuery);

                if (checkResult == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = $"Membership package dengan id {id} tidak ditemukan!"
                    });
                }

                var membershipExists = $"DELETE FROM membership_packages WHERE id = {id}";
                var membershipExisting = await _db.ExecuteQuery(_config, membershipExists);

                if (membershipExisting > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Data berhasil dihapus!",
                        data = membershipExisting
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
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, new
                {
                    status = false,
                    message = e.Message
                });
            }
        }
    }
}