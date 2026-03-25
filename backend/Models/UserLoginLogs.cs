using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class UserLoginLogs
    {
        [Key]
        public int id { get; set; }
        public int user_id { get; set; }
        public string ip_address { get; set; }
        public string user_agent { get; set; }
        public string attempt_type { get; set; }
        public bool success { get; set; }
        public string failure_reason { get; set; }
        public DateTime attempted_at { get; set; } = DateTime.Now;

        [ForeignKey("user_id")]
        public Users? Users { get; set; }
    }
}