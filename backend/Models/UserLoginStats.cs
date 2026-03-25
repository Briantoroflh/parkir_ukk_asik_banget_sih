using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class UserLoginStats
    {
        [Key]
        public int id { get; set; }
        public int user_id { get; set; }
        public int total_attempts { get; set; }
        public int total_failed_attempts { get; set; }
        public DateTime last_attempt_at { get; set; } = DateTime.Now;
        public DateTime last_success_at { get; set; } = DateTime.Now;
        public string last_failed_ip { get; set; }
        public bool is_locked { get; set; }
        public DateTime locked_at { get; set; } = DateTime.Now;
        public string locked_reason { get; set; }
        public DateTime updated_at { get; set; } = DateTime.Now;

        [ForeignKey("user_id")]
        public Users? Users { get; set; }
    }
}