using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Helpers;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly string _config;
        private readonly DBHelper _db;
        private readonly JwtHelper _jwt;

        public AuthController(IConfiguration configuration, DBHelper db, JwtHelper jwt)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
            _jwt = jwt;
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var storedRefreshToken = await GetStoredRefreshToken(request.refresh_token);

            if(storedRefreshToken == null || storedRefreshToken.expires_at.Value < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var userExists = $"SELECT id, name, email, role_id FROM users WHERE id={storedRefreshToken.user_id}";
            var userExisting = await _db.ToSingleModel<Users>(_config, userExists);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userExisting.id.ToString()),
                new Claim(ClaimTypes.Email, userExisting.email),
                new Claim(ClaimTypes.Name, userExisting.name),
                new Claim(ClaimTypes.Role, userExisting.role_id.ToString())
            };

            var newToken = _jwt.CreateToken(claims);
            var newRefreshToken = _jwt.GenerateRefreshToken();

            storedRefreshToken.refresh_token = newRefreshToken;
            storedRefreshToken.expires_at = DateTime.UtcNow.AddDays(7);
            await SaveRefreshToken(storedRefreshToken, userExisting.id);

            return Ok(new { accessToken = newToken, refreshToken = newRefreshToken });
        }

        [HttpPost]
        [Route("terminate-session")]
        public async Task<IActionResult> TerminateSession([FromBody] TerminateSessionRequest request)
        {


            var deleteSession = $"DELETE FROM user_sessions WHERE user_id = {request.user_id}";
            var deleteSessionRes = await _db.ExecuteQuery(_config, deleteSession);

            if(deleteSessionRes > 0)
            {
                return Ok(new
                {
                    status = true,
                    message = "User terminated!"
                });
            }else
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Maaf terjadi kesalahan!"
                });
            }
        }

        private async Task<UserSession> GetStoredRefreshToken(string refreshToken)
        {
            var q = $"SELECT * FROM user_sessions WHERE refresh_token='{refreshToken}'";
            var r = await _db.ToSingleModel<UserSession>(_config, q);

            return r;
        }

        private async Task<int> SaveRefreshToken(UserSession refreshToken, int user_id)
        {
            var expiresFormatted = refreshToken.expires_at.HasValue
                ? refreshToken.expires_at.Value.ToString("yyyy-MM-dd HH:mm:ss")
                : DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd HH:mm:ss");

            var q = $"UPDATE user_sessions SET refresh_token='{refreshToken.refresh_token}', expires_at='{expiresFormatted}' WHERE user_id='{user_id}'";
            var r = await _db.ExecuteQuery(_config, q);

            return r;
        }
    }
}