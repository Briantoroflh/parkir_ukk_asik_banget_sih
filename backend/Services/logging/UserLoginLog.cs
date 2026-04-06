using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services.logging
{
    public class UserLoginLog
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public UserLoginLog (IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        public async Task<int> LoggingLogin(int user_id, string ip_address, string device, int success, string failureReason)
        {
            var query = $"INSERT INTO user_login_logs (user_id, ip_address, user_agent, attempt_type, success, failure_reason, attempted_at) VALUES ({user_id}, '{ip_address}', '{device}', 'test', '{success}', '{failureReason}', NOW())";
            var result = await _db.ExecuteQuery(_config, query);

            if(result > 0)
            {
                return result;
            }
            else
            {
                return 0;
            }
        }
    }
}