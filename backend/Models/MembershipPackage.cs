using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MembershipPackage
    {
        [Key]
        public int id { get; set; }
        public string package_name { get; set; }
        public int price { get; set; }
        public int time_period_month { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
        public DateTime? deleted_at { get; set; } = DateTime.Now;
    }
}