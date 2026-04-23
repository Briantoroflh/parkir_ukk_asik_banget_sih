using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class TenantMember
    {
        [Key]
        public int id { get; set; }
        public string pic { get; set; }
        public string tenant_name { get; set; }
        public string status_membership { get; set; }
        public int total_bill { get; set; }
        public int total_current_payment { get; set; }
        public bool is_active { get; set; }
        public DateTime start_at { get; set; } = DateTime.Now;
        public DateTime? due_at { get; set; } = DateTime.Now;
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
        public DateTime? deleted_at { get; set; } = DateTime.Now;
    }
}