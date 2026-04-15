using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Employee
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public int role_id { get; set; }
        public DateTimeOffset created_at { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? updated_at { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? deleted_at { get; set; } = DateTimeOffset.UtcNow;
    }
}