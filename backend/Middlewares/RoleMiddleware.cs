using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Helpers;
using backend.Models;

namespace backend.Middlewares
{
    public class RoleMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly DBHelper _db;
        private readonly string _requiredRole;
        private readonly string _config;

        public RoleMiddleware(RequestDelegate next, DBHelper db, string role, IConfiguration configuration)
        {
            _next = next;
            _requiredRole = role;
            _db = db;
            _config = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                if (context.User.Identity != null && context.User.Identity.IsAuthenticated)
                {
                    var checkRoleQuery = $"SELECT id, name, description FROM roles WHERE name = '{_requiredRole}'";
                    var roleResult = await _db.ToSingleModel<Role>(_config, checkRoleQuery);

                    if (roleResult != null)
                    {
                        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);

                        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                        {
                            var getUserRoleQuery = $@"SELECT r.id, r.name, r.description FROM users u 
                                INNER JOIN roles r ON u.role_id = r.id 
                                WHERE u.id = {userId}";

                            var userRole = await _db.ToSingleModel<Role>(_config, getUserRoleQuery);

                            if (userRole != null && userRole.name.ToLower() == _requiredRole.ToLower())
                            {
                                await _next(context);
                                return;
                            }
                            else
                            {
                                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                                await context.Response.WriteAsJsonAsync(new
                                {
                                    status = false,
                                    message = $"Akses Ditolak: Anda memerlukan role '{_requiredRole}' untuk mengakses url ini!"
                                });
                                return;
                            }
                        }
                    }
                    else
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        await context.Response.WriteAsJsonAsync(new
                        {
                            status = false,
                            message = $"Role '{_requiredRole}' tidak ditemukan dalam sistem!"
                        });
                        return;
                    }
                }

                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await context.Response.WriteAsJsonAsync(new
                {
                    status = false,
                    message = "Akses Ditolak: Silakan login terlebih dahulu!"
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await context.Response.WriteAsJsonAsync(new
                {
                    status = false,
                    message = "Terjadi kesalahan server: " + ex.Message
                });
            }
        }
    }
}