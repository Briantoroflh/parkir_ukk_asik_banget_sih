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
using backend.Services.logging;
using backend.Services.sessions;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;
        private readonly JwtHelper _jwt;
        private readonly UserLoginLog _loginLog;
        private readonly UserSessions _userSession;

        public UsersController(IConfiguration configuration, DBHelper db, JwtHelper jwt, UserLoginLog loginLog, UserSessions userSession)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
            _jwt = jwt;
            _loginLog = loginLog;
            _userSession = userSession;
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

            try
            {
                if (verifyHashPassword)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, result.id.ToString()),
                        new Claim(ClaimTypes.Email, result.email),
                        new Claim("name", result.name),
                    };

                    var token = _jwt.CreateToken(claims);
                    var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                    var device = Request.Headers["User-Agent"].ToString();
                    var expiresAt = DateTime.UtcNow.AddHours(24);

                    var log = await _loginLog.LoggingLogin(result.id, ipAddress, device, 1, "success");
                    var session = await _userSession.CreateSession(result.id, token, ipAddress, device, expiresAt);

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
                    var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                    var device = Request.Headers["User-Agent"].ToString();

                    var log = await _loginLog.LoggingLogin(result.id, ipAddress, device, 0, "Password tidak sesuai");
                    return Unauthorized(new
                    {
                        status = false,
                        message = "Password anda tidak sesuai!"
                    });
                }
            }
            catch (Exception ex)
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var device = Request.Headers["User-Agent"].ToString();

                var log = await _loginLog.LoggingLogin(result.id, ipAddress, device, 0, ex.Message);

                return StatusCode(500, new
                {
                    status = false,
                    message = "Terjadi kesalahan server: " + ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("profile/{id}")]
        public async Task<ActionResult<Users>> Profile(int id)
        {
            var query = $"SELECT * FROM users WHERE id = {id}";
            var result = await _db.ToSingleModel<Users>(_config, query);

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
                    message = $"Data dengan id {id} tidak ditemukan!"
                });
            }
        }

        [Authorize]
        [HttpPut("update-user/{id}")]
        public async Task<ActionResult<Users>> UpdateUser(int id, [FromBody] UserUpdateDto users)
        {
            var existingUser = $"SELECT id FORM users WHERE id = {id}";
            var existsUser = await _db.ToSingleModel<Users>(_config, existingUser);

            if (existsUser != null)
            {
                var existingRole = $"SELECT * FROM roles WHERE id = {users.role_id}";
                var existsRole = await _db.ToSingleModel<Users>(_config, existingRole);

                if (existsRole == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "Role tidak ditemukan!"
                    });
                }

                var query = $"UPDATE users SET name = '{users.name}', email = '{users.email}', role_id = '{users.role_id}'";
                var result = await _db.ExecuteQuery(_config, query);

                if (result > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        message = $"Data berhasil di update!",
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
            else
            {
                return NotFound(new
                {
                    status = false,
                    message = $"data dengan id {id} tidak ditemukan!"
                });
            }
        }

        [HttpPost("create-user")]
        public async Task<ActionResult<Users>> CreateUser([FromBody] UserCreateDto users)
        {
            string password = BCrypt.Net.BCrypt.HashPassword(users.password_hash);

            var verifyRole = $"SELECT id FROM roles WHERE id = {users.role_id}";
            var resVerifyRole = await _db.ToSingleModel<Role>(_config, verifyRole);

            if (resVerifyRole == null)
            {
                return StatusCode(404, new
                {
                    status = false,
                    message = "Role tidak ditemukan!"
                });
            }

            var query = $"INSERT INTO users (name, email, password_hash, is_active, role_id, created_at) VALUES ('{users.name}','{users.email}','{password}', true, '{users.role_id}', NOW())";
            var result = await _db.ExecuteQuery(_config, query);

            if (result > 0)
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