using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services.sessions
{
    public class UserSessions
    {
        private readonly string _config;
        private readonly DBHelper _db;

        public UserSessions(IConfiguration configuration, DBHelper db)
        {
            _config = configuration.GetConnectionString("DefaultConnection");
            _db = db;
        }

        public async Task<int> CreateSession(int user_id, string token_hash, string ip_address, string user_agent, DateTime expires_at)
        {
            var checkQuery = $"SELECT user_id FROM user_sessions WHERE user_id = {user_id}";
            var checkResult = await _db.ExecuteQuery(_config, checkQuery);

            if (checkResult > 0)
            {
                var updateQuery = $"UPDATE user_sessions SET ip_address = '{ip_address}', user_agent = '{user_agent}', expires_at = '{expires_at:yyyy-MM-dd HH:mm:ss}' WHERE user_id = {user_id}";
                var result = await _db.ExecuteQuery(_config, updateQuery);

                return result > 0 ? result : 0;
            }
            else
            {
                var insertQuery = $"INSERT INTO user_sessions (user_id, token_hash, ip_address, user_agent, created_at, expires_at) VALUES ({user_id}, '{token_hash}', '{ip_address}', '{user_agent}', NOW(), '{expires_at:yyyy-MM-dd HH:mm:ss}')";
                var result = await _db.ExecuteQuery(_config, insertQuery);

                return result > 0 ? result : 0;
            }
        }

        public async Task<int> UpdateSessionActivity(int user_id, string session_token)
        {
            var query = $"UPDATE user_sessions SET last_activity = NOW() WHERE user_id = {user_id} AND session_token = '{session_token}' AND expires_at > NOW()";
            var result = await _db.ExecuteQuery(_config, query);

            if (result > 0)
            {
                return result;
            }
            else
            {
                return 0;
            }
        }

        public async Task<int> InvalidateSession(int user_id, string session_token)
        {
            var query = $"UPDATE user_sessions SET expires_at = NOW() WHERE user_id = {user_id} AND session_token = '{session_token}'";
            var result = await _db.ExecuteQuery(_config, query);

            if (result > 0)
            {
                return result;
            }
            else
            {
                return 0;
            }
        }

        public async Task<int> CleanExpiredSessions()
        {
            var query = "DELETE FROM user_sessions WHERE expires_at < NOW()";
            var result = await _db.ExecuteQuery(_config, query);

            if (result > 0)
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