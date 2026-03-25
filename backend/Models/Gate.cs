using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Gate
    {
        [Key]
        public int id { get; set; }
        public string created_by { get; set; }
        public int zone_id { get; set; }
        public string name { get; set; }
        public string gate_type { get; set; }
        public string location_desc { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
    }
}