using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Helpers;
using backend.Models;
using backend.DTOs.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;
        private readonly JwtHelper _jwt;

        public UsersController(IConfiguration configuration, DBHelper db, JwtHelper jwt)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
            _jwt = jwt;  
        }

        [HttpPost("login")]
        public async Task<ActionResult<Users>> Login([FromBody] UserLoginDto users)
        {
            var query = $"SELECT * FROM users WHERE email = '{users.email}'";
            var result = await _db.ToSingleModel<Users>(_config, query);

            if (result == null)
            {
                return Unauthorized(new
                {
                    status = false,
                    message = $"email {users.email} atau password anda tidak ditemukan!"
                });
            }

            var verifyHashPassword = BCrypt.Net.BCrypt.Verify(users.password, result.password_hash);

            if (verifyHashPassword)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, result.id.ToString()),
                    new Claim(ClaimTypes.Email, result.email),
                    new Claim("name", result.name),
                };

                var token = _jwt.CreateToken(claims);

                return Ok(new
                {
                    status = true,
                    message = $"Login Berhasil. Halo, {result.name}",
                    token = token,
                    data = result
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

        [Authorize]
        [HttpGet("profile/{id}")]
        public async Task<ActionResult<Users>> Profile(int id)
        {
            var query = $"SELECT * FROM users WHERE id = {id}";
            var result = await _db.ToSingleModel<Users>(_config, query);

            if(result != null)
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
                   message = $"Data dengan id {id} tidak ditemukan!" 
                });
            }
        }

        [Authorize]
        [HttpPost("create-user")]
        public async Task<ActionResult<Users>> CreateUser([FromBody] UserCreateDto users)
        {
            DBHelper DB = new DBHelper();

            string password = BCrypt.Net.BCrypt.HashPassword(users.password_hash);

            var verifyRole = $"SELECT id FROM roles WHERE id = {users.role_id}";
            var resVerifyRole = await DB.ToSingleModel<Role>(_config, verifyRole);

            if(resVerifyRole == null)
            {
                return StatusCode(404, new
                {
                    status = false,
                    message = "Role tidak ditemukan!"
                });
            }

            var query = $"INSERT INTO users (name, email, password_hash, is_active, role_id, created_at) VALUES ('{users.name}','{users.email}','{password}', true, '{users.role_id}', NOW())";
            var result = await DB.ExecuteQuery(_config, query);

            if(result > 0)
            {
                return Ok(new
                {
                    status = true,
                    message = "User berhasil ditambahkan!",
                    data = result
                });
            }
            else
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Gagal menambahkan data!"
                });
            }
        }

    }
}