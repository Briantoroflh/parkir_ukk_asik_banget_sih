using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/role")]
    public class RoleController
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public RoleController (IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        // [Authorize]
        // [HttpGet("get-all")]
        // public async Task<ActionResult<IEnumerable<Role>>> GetAllRole()
        // {
        //     var 
        // }
    }
}