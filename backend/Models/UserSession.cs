using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class UserSession
    {
        [Key]
        public int id { get; set; }
        public int user_id { get; set; }
        public string refresh_token { get; set; }
        public string ip_address { get; set; }
        public string user_agent { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? expires_at { get; set; } = DateTime.Now;
        public DateTime? revoked_at { get; set; } = DateTime.Now;
    }
}