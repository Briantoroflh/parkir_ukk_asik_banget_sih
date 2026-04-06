using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Middlewares;

namespace backend.Services.extensions
{
    public static class RoleExtension
    {
        public static IApplicationBuilder UseRole(this IApplicationBuilder builder, string role)
        {
            return builder.UseMiddleware<RoleMiddleware>(role);
        }
    }
}